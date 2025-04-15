import { GuildMember, Message, PermissionFlagsBits } from "discord.js";
import { Command } from "~/structure/Command";
import { Constants } from "~/util/constants";
import { cooldown } from "~/lib/controller/cooldown";
import { argsCheck } from "~/lib/controller/argsCheck";
import { createUser } from "~/root/database/services/user";

export default async function (message: Message) {
	if (message.author.bot || message.system || !message.inGuild()) return;

	createUser(message.author.id);

	const prefixes = ["zcro", "zo"];

	const messageContentLower = message.content.toLowerCase();
	let usedPrefix = null;
	let contentAfterPrefix = "";

	for (const prefix of prefixes) {
		const prefixLower = prefix.toLowerCase();

		if (messageContentLower.startsWith(prefixLower + " ")) {
			usedPrefix = prefix;
			contentAfterPrefix = message.content.slice(prefix.length + 1);
			break;
		} else if (messageContentLower.startsWith(prefixLower)) {
			usedPrefix = prefix;
			contentAfterPrefix = message.content.slice(prefix.length);
			break;
		}
	}

	if (!usedPrefix) return;

	const args = contentAfterPrefix.trim().split(/ +/);
	const cmd = args.shift()?.toLowerCase();
	if (!cmd) return;

	const availableCommands = message.client.chatInputCommands.filter(
		(cmd) => cmd.availability === Command.Availability.Both
	);

	const command =
		availableCommands.get(cmd) ??
		availableCommands.find((c) => c.aliases.includes(cmd));

	if (command) {
		if (command.ownerOnly && !Constants.owners.includes(message.author.id)) {
			return;
		}

		if (command.cooldown && !cooldown(message, command)) {
			return;
		}

		if (command.args.length && !argsCheck(message, command.args, args)) return;

		try {
			const memberPerms = message.channel.permissionsFor(
				message.guild.members.me as GuildMember
			);

			if (!memberPerms.has(PermissionFlagsBits.ReadMessageHistory)) {
				return await message.channel.send(
					`${message.author}, I don't have \`Read Message History\` Permission in this channel.`
				);
			}

			if (!memberPerms.has(PermissionFlagsBits.EmbedLinks)) {
				return await message.reply({
					content: "I don't have `Embed Links` Permission in this channel.",
				});
			}

			await command.messageRun(message, args, message.client, usedPrefix);
		} catch (error) {
			message.client.emit("customError", error, {
				name: command.name,
				user: message.author,
				guild: message.guild,
			});
		}
	} else {
		const chatInputCommand = message.client.chatInputCommands.get(cmd);
		if (chatInputCommand && !chatInputCommand.ownerOnly) {
			await message.reply(
				`Hey! It's a slash only command. Use \`/${cmd}\` instead.`
			);
		}
	}
}
