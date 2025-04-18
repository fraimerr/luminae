import prisma from "@parallel/db";
import { Giveaways } from "@prisma/client";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Interaction,
	TextChannel,
} from "discord.js";
import { client } from "~/root/main";
import { Constants } from "~/util/constants";
import { generateId } from "~/util/generateId";

export class GiveawayManager {
	public static async create(data: {
		interaction: Interaction;
		channel: TextChannel;
		title: string;
		description?: string;
		duration: number;
		winners: number;
		requirements?: [];
		multipliers?: [];
	}): Promise<Giveaways> {
		const endAt = new Date(Date.now() + data.duration);

		console.log(endAt);

		let giveaway = await prisma.giveaways.create({
			data: {
				giveawayId: generateId(),
				guildId: data.channel.guild.id,
				channelId: data.channel.id,
				title: data.title,
				description: data.description || "",
				winners: data.winners || 1,
				startAt: Date.now(),
				endAt: endAt.getTime(),
				requirements: data.requirements || [],
				multipliers: data.multipliers || [],
			},
		});

		const { embed, row } = this.createEmbed(data.interaction, giveaway);

		const message = await data.channel.send({
			embeds: [embed],
			components: [row],
		});

		giveaway = await prisma.giveaways.update({
			where: { giveawayId: giveaway.giveawayId },
			data: { messageId: message.id },
		});

		console.log(giveaway.messageId);

		this.scheduleEnd(giveaway);

		return giveaway;
	}

	public static createEmbed(
		interaction: Interaction,
		giveaway: Giveaways
	): {
		embed: EmbedBuilder;
		row: ActionRowBuilder<ButtonBuilder>;
	} {
		const embed = new EmbedBuilder()
			.setTitle(`${giveaway.title}`)
			.setColor(Constants.primaryColor)
			.setDescription(
				giveaway.description +
					`\n\n` +
					`${Constants.emojis.clock} Ends: <t:${Math.floor(
						giveaway.endAt! / 1000
					)}:R>` +
					`\n` +
					`${Constants.emojis.person} Host: <@${interaction.user.id}>`
			)
			.setFooter({
				text: `${
					giveaway.winners === 1 ? "1 winner" : `${giveaway.winners} winners`
				}`,
			})
			.setThumbnail("https://cdn3.emoji.gg/emojis/9140_confetti.gif")
			.setTimestamp();

		if (giveaway.requirements.length > 0) {
			embed.addFields({
				name: "Requirements",
				value: giveaway.requirements
					.map((r) => {
						if (r.type === "role") {
							return `- Must have the <@&${r.value}> role`;
						} else if (r.type === "not_role") {
							return `- Must not have the <@&${r.value}> role`;
						} else if (r.type === "message") {
							return `- Must have **${r.value} messages**`;
						} else if (r.type === "level") {
							return `- Must be **Level ${r.value}**`;
						} else if (r.type === "streak") {
							return `- Must have a **${r.value} day** streak`;
						} else if (r.type === "account_age") {
							return `- Account must be **${r.value} days old**`;
						} else if (r.type === "booster") {
							return `- Must be a **booster**`;
						}
					})
					.join("\n"),
			});
		}

		if (giveaway.multipliers.length > 0) {
			embed.addFields({
				name: "Multipliers",
				value: giveaway.multipliers
					.map((m) => {
						if (m.type === "role") {
							return `- Users with <@&${m.value}> get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "not_role") {
							return `- Users without <@&${m.value}> get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "message") {
							return `- Users with **${m.value} messages** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "level") {
							return `- Users with **Level ${m.value}** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "streak") {
							return `- Users with a **${m.value} day** streak get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "account_age") {
							return `- Users that are **${m.value} days old** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						} else if (m.type === "booster") {
							return `- Users that are a **booster** get [\`+${m.entries} entries\`](https://youtu.be/dQw4w9WgXcQ?si=HKusQk05PwzGkUf7)`;
						}
					})
					.join("\n"),
			});
		}

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`join-giveaway-${giveaway.giveawayId}`)
				.setEmoji(Constants.emojis.confetti)
				.setLabel("Join (0)")
				.setStyle(ButtonStyle.Secondary)
		);

		return { embed, row };
	}

	private static async endGiveaway(messageId: string) {
		const giveaway = await prisma.giveaways.findUnique({
			where: { messageId },
		});

		if (!giveaway || giveaway.ended) return null;

		await prisma.giveaways.update({
			where: { messageId: giveaway.messageId! },
			data: { ended: true, endAt: Date.now() },
		});

		const winners = this.getWinners(giveaway);
		const channel = await this.getChannel(giveaway.channelId!);

		if (channel) {
			const message = await channel.messages.fetch(messageId);
			const embed = this.createEndEmbed(giveaway, winners);

			await message.edit({
				embeds: [embed],
				components: [],
			});

			if (winners.length > 0) {
				await message.reply({
					content: `${Constants.emojis.confetti} | ${winners.map(
						(w) => `<@${w}>`
					)}`,
					embeds: [
						new EmbedBuilder()
							.setColor(Constants.primaryColor)
							.setDescription(
								`Congratulations! You won **${giveaway.title}**!`
							),
					],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							new ButtonBuilder()
								.setLabel("Go to Giveaway")
								.setURL(message.url)
								.setStyle(ButtonStyle.Link)
						),
					],
				});
			}
		}
	}

	private static getWinners(giveaway: Giveaways, winnersCount?: number) {
		const validEntries = giveaway.entries.filter(
			(e, i, a) => a.indexOf(e) === i
		);
		const count = winnersCount || giveaway.winners!;

		if (validEntries.length < count) return validEntries;
		return validEntries.sort(() => Math.random() - 0.5).slice(0, count);
	}

	private static createEndEmbed(
		giveaway: Giveaways,
		winners: string[]
	): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(`${giveaway.title}`)
			.setColor(Constants.primaryColor)
			.setDescription(
				`${giveaway.description}` +
					`\n\n` +
					`Ended: <t:${Math.floor(giveaway.endAt! / 1000)}:R>` +
					`\n` +
					`Winners: ${winners.map((w) => `<@${w}>`).join(", ")}`
			)
			.setFields()
			.setFooter({
				text: `${
					giveaway.winners === 1 ? "1 winner" : `${giveaway.winners} winners`
				}`,
			})
			.setTimestamp();
	}

	private static scheduleEnd(giveaway: Giveaways) {
		const remainingTime = giveaway.endAt! - Date.now();
		if (remainingTime <= 0) return;

		setTimeout(async () => {
			await this.endGiveaway(giveaway.messageId!);
		}, remainingTime);
	}

	public static async initGiveaways() {
		const giveaways = await prisma.giveaways.findMany({
			where: { ended: false },
		});

		for (const giveaway of giveaways) {
			this.scheduleEnd(giveaway);
		}
	}

	public static async getOverdueGiveaways() {
		const giveaways = await prisma.giveaways.findMany({
			where: { ended: false },
		});

		for (const giveaway of giveaways) {
			if (giveaway.endAt! < Date.now()) {
				await this.endGiveaway(giveaway.messageId!);
			}
		}
	}

	private static async getChannel(
		channelId: string
	): Promise<TextChannel | null> {
		try {
			return (await client.channels.fetch(channelId)) as TextChannel;
		} catch {
			return null;
		}
	}
}
