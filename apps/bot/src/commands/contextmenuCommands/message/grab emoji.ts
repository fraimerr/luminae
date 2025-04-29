import { ApplicationCommandType, type ChatInputCommandInteraction } from "discord.js";

import type { Command } from "~/structure/Command";
import type { ContextMenuMessageCommand } from "~/types/command";

export const command: ContextMenuMessageCommand = {
  name: "grab emoji",
  type: ApplicationCommandType.Message,

  async runTask(interaction) {
    const message = interaction.targetMessage;
    await interaction.client.chatInputCommands.get("enlarge")!.interactionRun(
      interaction as unknown as ChatInputCommandInteraction<"cached">,
      {
        getString() {
          return message.content + (message.embeds[0]?.description ?? "");
        },
      } as unknown as Command.ChatInputOptions,
      interaction.client,
    );
  },
};
