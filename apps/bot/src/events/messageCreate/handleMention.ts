import { Message } from "discord.js";

import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { PRIMARY_COLOR, SUPPORT_SERVER } from "@parallel/shared/utils/constants";

export default async function (message: Message) {
	if (message.author.bot || !message.mentions.has(message.client.user)) return;
	const content = message.content.trim();
	const mention = `<@${message.client.user.id}>`;
	if (content === mention || content === `<@!${message.client.user.id}>`) {
		const mentionEmbed = new EmbedBuilder()
			.setColor(PRIMARY_COLOR)
			.setTitle("Hey! I'm Parallel!")
			.setThumbnail(message.client.user.displayAvatarURL())
			.setDescription(
				`I only listen for **Slash Commands**! I feature an advanced leveling systems and customizable giveaways. With many more features to come!`
			)
			.addFields({
				name: "Getting Started",
				value: `To start using me, use </help:1342231333040291942> for a full list of my commands!`,
			});

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel("Website")
				.setEmoji("🌐")
				.setStyle(ButtonStyle.Link)
				.setURL("https://blogs.mtdv.me/parallel"),
			new ButtonBuilder()
				.setLabel("Support Server")
				.setEmoji("🏠")
				.setStyle(ButtonStyle.Link)
				.setURL(SUPPORT_SERVER)
		);

		await message.reply({
			embeds: [mentionEmbed],
			components: [buttons],
		});
	}
}
