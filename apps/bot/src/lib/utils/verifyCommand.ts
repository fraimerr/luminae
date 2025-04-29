import {
	WebhookClient,
	type ChatInputCommandInteraction,
	type Client,
	type ContextMenuCommandInteraction,
} from "discord.js";

import { Constants } from "./constants";
import { syncCommands } from "./syncCommand";

import { cooldown } from "../controller/cooldown";

import type {
	ContextMenuMessageCommand,
	ContextMenuUserCommand,
} from "~/types/command";
import type { Command } from "../structures/Command";
import prisma from "@luminae/db";

export const verifyCommand = async (
	interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
	command:
		| Command
		| ContextMenuMessageCommand
		| ContextMenuUserCommand
		| undefined,
	client: Client<true>
) => {
	if (!command) {
		if (!interaction.commandName) return false;
		await interaction.reply({
			content: "This command might have been removed. Try again later.",
			ephemeral: true,
		});
		const wh = new WebhookClient({
			url: process.env.REPORT_WEBHOOK_URL!,
		});
		wh.send({
			username: "Invalid Command",
			avatarURL: client.user.displayAvatarURL(),
			content: `${interaction.user.tag} tried to use a command \`${interaction.commandName}\`  that doesn't exist.\n Refreshing commands...`,
		}).catch(() => null);
		const refreshed = await syncCommands(client).catch(() => null);
		if (!refreshed) {
			wh.send({
				username: "Error Sync Commands",
				avatarURL: client.user.displayAvatarURL(),
				content: "Something went wrong while synchronizing the commands.",
			}).catch(() => null);
			return false;
		}

		wh.send({
			username: "Refreshed",
			avatarURL: client.user.displayAvatarURL(),
			content: "Commands have been synchronized.",
		}).catch(() => null);
		return false;
	}

	if (command.ownerOnly && !Constants.owners.includes(interaction.user.id)) {
		await interaction.reply({
			content: "This command is only available for bot owners.",
			ephemeral: true,
		});
		return false;
	}

	if (interaction.inCachedGuild()) {
		const data = await prisma.guilds.findUnique({
			where: {
				guildId: interaction.guild.id,
			},
		});
		if (!data) return false;
	} else if (interaction.inGuild()) {
		await interaction.reply({
			content: "This server isn't cached yet. Try again later.",
			ephemeral: true,
		});
		return false;
	} else if (!command.allowDM) {
		await interaction.reply({
			content: "This command can only be used in a guild.",
			ephemeral: true,
		});
		return false;
	}

	return !command.cooldown || cooldown(interaction, command);
};
