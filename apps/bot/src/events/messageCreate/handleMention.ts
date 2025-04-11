import { Message } from "discord.js";

import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { Constants } from "~/util/constants";

export default async function (message: Message) {
	if (message.author.bot || !message.mentions.has(message.client.user)) return;
	const content = message.content.trim();
	const mention = `<@${message.client.user.id}>`;
	if (content === mention || content === `<@!${message.client.user.id}>`) {
		const mentionEmbed = new EmbedBuilder()
			.setColor(Constants.primaryColor)
			.setTitle("Hey! I'm Misu!")
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
				.setStyle(ButtonStyle.Link)
				.setURL("https://blogs.mtdv.me/misu"),
			new ButtonBuilder()
				.setLabel("Community")
				.setStyle(ButtonStyle.Link)
				.setURL("https://blogs.mtdv.me/misu")
		);

		await message.reply({
			embeds: [mentionEmbed],
			components: [buttons],
		});
	}
}
