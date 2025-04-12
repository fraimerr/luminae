import {
	EmbedBuilder,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	Message,
	InteractionContextType,
} from "discord.js";
import { ApplyCommandOption, Command } from "~/structure/Command";
import { Constants } from "~/util/constants";
import { authorOrUser, handleReply } from "~/util/utils";
import { getOrCreateLevelData } from "~/root/database/services/leveling";
import { lazyFormattedTime } from "~/util/formatter";

@ApplyCommandOption(
	new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get detailed information about a user")
		.setContexts(InteractionContextType.Guild)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription(
					"The user to get information about (defaults to yourself)"
				)
				.setRequired(false)
		),
	{
		usage: "`{p}info [user]`",
		aliases: ["i", "information", "profile"],
		allowDM: false,
	}
)
export class UserCommand extends Command {
	protected override async runTask(
		messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message
	) {
		try {
			const user = authorOrUser(messageOrInteraction);

			const forceUser = await messageOrInteraction.guild?.members
				.fetch(user.id)
				.catch(() => null);

			if (!forceUser) {
				return handleReply(
					messageOrInteraction,
					{
						content: "Could not fetch that user's information.",
					},
					true
				);
			}

			const levelData = await getOrCreateLevelData(
				user.id,
				messageOrInteraction.guild!.id,
				false
			);

			const joinedAt = forceUser.joinedAt;
			const createdAt = user.createdAt;

			const voiceTime = lazyFormattedTime(levelData.voiceTime * 1000);

			const embed = new EmbedBuilder()
				.setColor(forceUser.displayHexColor || Constants.primaryColor)
				.setTitle(`${user.username}'s Profile`)
				.addFields(
					{
						name: "Messages",
						value: `\`\`\`${levelData.messages.toLocaleString()} messages\`\`\``,
						inline: true,
					},
					{
						name: "Voice",
						value: `\`\`\`${voiceTime}\`\`\``,
						inline: true,
					},
					{
						name: "Streak",
						value: `\`\`\`No streak\`\`\``,
						inline: true,
					},
					{
						name: "Last Activity:",
						value: `<t:${Math.floor(levelData.lastUpdate.getTime() / 1000)}:R>`,
						inline: true,
					},
					{
						name: "Joined",
						value: joinedAt
							? `<t:${Math.floor(
									joinedAt.getTime() / 1000
							  )}:D> (<t:${Math.floor(joinedAt.getTime() / 1000)}:R>)`
							: "Unknown",
						inline: true,
					},
					{
						name: "Account Created",
						value: `<t:${Math.floor(
							createdAt.getTime() / 1000
						)}:D> (<t:${Math.floor(createdAt.getTime() / 1000)}:R>)`,
						inline: true,
					}
				)
				.setThumbnail(user.displayAvatarURL({ size: 2048, extension: "png" }))
				.setTimestamp();

			if (user.banner) {
				embed.setImage(
					user.bannerURL({ size: 2048, extension: "png" }) || null
				);
			}

			await handleReply(messageOrInteraction, { embeds: [embed] });
		} catch (error) {
			console.error("Error in info command:", error);
			return handleReply(messageOrInteraction, {
				content:
					"There was an error fetching the user information. Please try again later.",
				ephemeral: true,
			});
		}
	}
}
