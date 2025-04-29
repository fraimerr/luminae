import { ApplicationCommandType } from "discord.js";

import type { Command } from "~/structure/Command";
import type { ContextMenuUserCommand } from "~/types/command";
import type { ChatInputCommandInteraction } from "discord.js";

export const command: ContextMenuUserCommand = {
  name: "userinfo",
  type: ApplicationCommandType.User,
  async runTask(interaction, options) {
    await interaction.client.chatInputCommands
      .get("userinfo")!
      .interactionRun(
        interaction as unknown as ChatInputCommandInteraction<"cached">,
        options as Command.ChatInputOptions,
        interaction.client,
      );
  },
};
