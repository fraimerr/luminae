import {
	ApplicationCommandType,
	Interaction,
	InteractionType,
	MessageFlags,
} from "discord.js";
import { createUser } from "~/root/database/services/user";
import { verifyCommand } from "~/util/verifyCommand";

export default async function (interaction: Interaction) {
	if (!interaction.client.isReady() || interaction.client.uptime < 5_000)
		return;

	await createUser(interaction.user.id);

	if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
		const command = interaction.client.chatInputCommands.get(
			interaction.commandName
		);
		if (!command) return;

		await command.autocompleteRun(
			interaction,
			interaction.options,
			interaction.client
		);
	} else if (interaction.isChatInputCommand()) {
		const command = interaction.client.chatInputCommands.get(
			interaction.commandName
		);
		if (
			!(await verifyCommand(interaction, command, interaction.client)) ||
			!command
		) {
			return;
		}

		try {
			await command.interactionRun(
				interaction,
				interaction.options,
				interaction.client
			);
		} catch (error) {
			if (!interaction.replied && !interaction.deferred) {
				await interaction
					.reply({
						content:
							"Sorry, but something seems to have gone wrong. Please try again.",
						flags: MessageFlags.Ephemeral,
					})
					.catch(() => null);
			}

			interaction.client.emit("customError", error, {
				name: interaction.commandName,
				user: interaction.user,
				guild: interaction.guild,
			});
		}
	} else if (interaction.isContextMenuCommand()) {
		const command = interaction.client.contextmenuCommands.get(
			interaction.commandName
		);
		if (
			!(await verifyCommand(interaction, command, interaction.client)) ||
			!command
		) {
			return;
		}

		try {
			if (
				command.type === ApplicationCommandType.Message &&
				interaction.isMessageContextMenuCommand() &&
				interaction.inCachedGuild()
			) {
				await command.runTask(
					interaction,
					interaction.options,
					interaction.client
				);
			}

			if (
				command.type === ApplicationCommandType.User &&
				interaction.isUserContextMenuCommand() &&
				interaction.inCachedGuild()
			) {
				await command.runTask(
					interaction,
					interaction.options,
					interaction.client
				);
			}
		} catch (error) {
			if (!interaction.replied && !interaction.deferred) {
				await interaction
					.reply({
						content: "I apologize, something went wrong.",
						flags: MessageFlags.Ephemeral,
					})
					.catch(() => null);
			}

			interaction.client.emit("customError", error, {
				name: interaction.commandName,
				user: interaction.user,
				guild: interaction.guild,
			});
		}
	}
}
