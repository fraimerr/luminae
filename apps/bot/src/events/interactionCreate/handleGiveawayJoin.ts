import prisma from "@luminae/db";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	MessageFlags,
} from "discord.js";
import { getLevelData } from "~/root/database/services/leveling";
import { Constants } from "~/util/constants";

export default async function (interaction: ButtonInteraction) {
	if (!interaction.isButton()) return;
	if (!interaction.customId.startsWith("join-giveaway-")) return;
	if (!interaction.guild) return;

	const giveawayId = interaction.customId.split("join-giveaway-")[1];
	const giveaway = await prisma.giveaways.findUnique({ where: { giveawayId } });

	if (!giveaway || giveaway.ended) return;

	const levelData = await getLevelData(
		interaction.user.id,
		interaction.guild.id
	);
	const member = await interaction.guild.members.fetch(interaction.user.id);

	if (giveaway.requirements.length > 0) {
		for (const req of giveaway.requirements) {
			if (req.type === "role") {
				if (!member.roles.cache.has(String(req.value))) {
					return interaction.reply({
						content: "You don't have the required role to join this giveaway!",
						flags: [MessageFlags.Ephemeral],
					});
				}
			} else if (req.type === "message") {
				if ((levelData?.messages || 0) < Number(req.value)) {
					return interaction.reply({
						content: "You don't have enough messages to join this giveaway!",
						flags: [MessageFlags.Ephemeral],
					});
				}
			}
		}
	}

	if (giveaway.multipliers.length > 0) {
		for (const multiplier of giveaway.multipliers) {
			if (multiplier.type === "role") {
				if (member.roles.cache.has(String(multiplier.value))) {
					await prisma.giveaways.update({
						where: { giveawayId },
						data: {
							entries: {
								push: interaction.user.id,
							},
						},
					});
				}
			}
		}
	}

	const message = await interaction.message.fetch();

	const button = new ButtonBuilder()
		.setCustomId(`join-giveaway-${giveaway.giveawayId}`)
		.setEmoji(Constants.emojis.confetti)
		.setStyle(ButtonStyle.Secondary);

	if (giveaway.entries.includes(interaction.user.id)) {
		const updatedEntries = giveaway.entries.filter(
			(id) => id !== interaction.user.id
		);

		await prisma.giveaways.update({
			where: { id: giveaway.id },
			data: {
				entries: updatedEntries,
			},
		});

		button.setLabel(`Join (${updatedEntries.length})`);

		await message.edit({
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
		});

		return interaction.reply({
			content: "You successfully left the giveaway!",
			flags: [MessageFlags.Ephemeral],
		});
	}

	await prisma.giveaways.update({
		where: { id: giveaway.id },
		data: {
			entries: {
				push: interaction.user.id,
			},
		},
	});

	const updatedGiveaway = await prisma.giveaways.findUnique({
		where: { id: giveaway.id },
	});

	button.setLabel(`Join (${updatedGiveaway?.entries.length})`);

	await message.edit({
		components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
	});

	return interaction.reply({
		content: "You successfully joined the giveaway!",
		flags: [MessageFlags.Ephemeral],
	});
}
