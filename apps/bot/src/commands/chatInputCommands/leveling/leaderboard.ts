import prisma from "@misu/db";
import {
	EmbedBuilder,
	InteractionContextType,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type Message,
} from "discord.js";

import { ApplyCommandOption, Command } from "~/structure/Command";
import { Constants } from "~/util/constants";

@ApplyCommandOption(
	new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("View the level leaderboard")
		.setContexts(InteractionContextType.Guild),
	{
		usage: "`{p}leaderboard`",
		aliases: ["l", "lb"],
		allowDM: false,
	}
)
export class UserCommand extends Command {
	protected override async runTask(
		messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message<true>
	) {
		const leaderboard = await prisma.leveling.findMany({
			where: { guildId: messageOrInteraction.guild.id },
			orderBy: { xp: "desc" },
		});

		if (!leaderboard.length) {
			return messageOrInteraction.reply({
				content: "Leaderboard is empty",
			});
		}

		const embed = new EmbedBuilder()
			.setColor(Constants.primaryColor)
			.setTitle("Pong!")
			.setDescription(
				leaderboard
					.map((user, i) => {
						return `${i + 1}. <@${user.userId}> - **Level ${user.level}**`;
					})
					.join("\n")
			)
			.setTimestamp()
			.setFooter({
				text: messageOrInteraction.client.user.username,
				iconURL: messageOrInteraction.client.user.displayAvatarURL(),
			});

		messageOrInteraction.reply({ embeds: [embed] });
	}
}
