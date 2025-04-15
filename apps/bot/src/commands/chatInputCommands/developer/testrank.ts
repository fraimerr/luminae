import prisma from "@zcro/db";
import {
	SlashCommandBuilder,
	InteractionContextType,
	Awaitable,
	ChatInputCommandInteraction,
	Client,
	Message,
} from "discord.js";
import { ApplyCommandOption, Command } from "~/structure/Command";

@ApplyCommandOption(
	new SlashCommandBuilder()
		.setName("testrank")
		.setDescription("Test wamoone's rank card")
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

		const user = interaction.user;

		const levelingData = await prisma.leveling.findUnique({
			where: {
				userId_guildId: { userId: user.id, guildId: interaction.guildId },
			},
		});

		const raw = JSON.stringify({
			user: {
				id: user.id,
				username: user.username,
				avatar: user.avatarURL({ size: 1024, extension: "png" }),
			},
			// customUsername: "",
			presenceStatus: "dnd",
			borderColor: "#FF5733",
			tagColor: "#A9A9A9",
			showUsernameBadge: true,
			// customBackground: "https://i.imgur.com/FyqQs5A.png",
			backgroundBrightness: 10,
			usernameColor: "#00FF00",
			rankData: {
				progressPercent: 75,
				currentXp: 750,
				requiredXp: 1000,
				level: 5,
				rank: 3,
				barColor: "#FF5733",
				levelColor: "#FFA500",
				autoColorRank: true,
			},
		});

		const response = await fetch(
			"https://api.wamoone.com/v6/open-dev/cards/rank",
			{
				method: "POST",
				headers: {
					Authorization:
						"d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
					"Content-Type": "application/json",
				},
				body: raw,
			}
		);

		const data = (await response.json()) as { data: { image: string } };

    console.log(data);

		await interaction.reply({
			files: [data.data.image],
		});
	}
}
