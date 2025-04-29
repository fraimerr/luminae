import prisma from "@luminae/db";
import {
	SlashCommandBuilder,
	InteractionContextType,
	Awaitable,
	ChatInputCommandInteraction,
	Client,
	Message,
} from "discord.js";
import { LevelingManager } from "~/manager/leveling/LevelingManager";
import { getLevelData } from "~/root/database/services/leveling";
import { ApplyCommandOption, Command } from "~/structure/Command";

@ApplyCommandOption(
	new SlashCommandBuilder()
		.setName("testlb")
		.setDescription("Test wamoone's leaderboard")
		.setContexts(InteractionContextType.Guild),
	{
		usage: "`{p}testrank`",
		aliases: ["tr"],
		allowDM: false,
	}
)
export class UserCommand extends Command {
	protected override async runTask(
		messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message<true>,
		options: Command.ChatInputOptions,
		client: Client<true>
	) {
		const interaction =
			messageOrInteraction as ChatInputCommandInteraction<"cached">;

		const levelingData = await prisma.guildUser.findMany({
			where: { guildId: interaction.guildId! },
			orderBy: { xp: "desc" },
		});

		const entries = levelingData
			.map((data, i) => {
				const user = interaction.guild?.members.cache.get(data.userId)?.user;

				if (!data) return null;
				if (!user) return null;

				return {
					user: {
						id: data.userId,
						username: user.username,
						avatar: user.avatarURL({ size: 1024, extension: "png" }),
					},
					rankData: {
						progressPercent:
							(data.xp / LevelingManager.getXp(data.level + 1)) * 100,
						currentXp: data.xp,
						requiredXp: LevelingManager.getXp(data.level + 1),
						level: data.level,
						rank: i + 1,
					},
				};
			})
			.filter((entry) => entry !== null);

		const raw = JSON.stringify({
			entries,
			theme: {
				borderColor: "#5865F2",
				usernameColor: "#FFFFFF",
				textColor: "#B0B0B0",
				barColor: ["#5865F2", "#8B5CF6"],
				disableBackgroundBlur: true,
				backgroundBrightness: 100,
				removeBorder: true,
				colorTopRanks: true,
			},
		});

		const response = await fetch("https://api.wamoone.com/v6/dev/card/leader", {
			method: "POST",
			headers: {
				Authorization:
					"d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
				"Content-Type": "application/json",
			},
			body: raw,
		});

		const data = (await response.json()) as { data: { image: string } };

		console.log(data);

		await interaction.reply({
			files: [data.data.image],
		});
	}
}
