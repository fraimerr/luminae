import { performance } from 'node:perf_hooks';

import { EmbedBuilder, SlashCommandBuilder, type ChatInputCommandInteraction, type Message } from 'discord.js';
import mongoose from 'mongoose';

import { ApplyCommandOption, Command } from '~/structure/Command';
import { Constants } from '~/util/constants';
import { formatMs } from '~/util/utils';

@ApplyCommandOption(new SlashCommandBuilder().setName('ping').setDescription('Shows the current latency of bot'), {
	usage: '`{p}ping`',
	aliases: ['p'],
	allowDM: true,
})
export class UserCommand extends Command {
	protected override async runTask(messageOrInteraction: ChatInputCommandInteraction<'cached'> | Message<true>) {
		const embed = new EmbedBuilder()
			.setColor(Constants.primaryColor)
			.setTitle("Pong!")
			.setDescription(`Pinging...`)
			.setTimestamp()
			.setFooter({
				text: messageOrInteraction.client.user.username,
				iconURL:messageOrInteraction.client.user.displayAvatarURL(),
			});
		const message = await messageOrInteraction.reply({
			embeds: [embed],
			fetchReply: true,
		});
		const ping = message.createdTimestamp - messageOrInteraction.createdTimestamp;
		const start = performance.now();
		await mongoose.connection.db.command({ ping: 1 });
		const end = performance.now();
		embed.setDescription(
			`\n**Websocket heartbeat**: ${formatMs(messageOrInteraction.client.ws.ping)}` +
				`\n**Roundtrip latency**: ${formatMs(ping)}` +
				`\n**DB latency**: ${formatMs(end - start)}`
		);
		message.edit({ embeds: [embed] }).catch(() => null);
	}
}
