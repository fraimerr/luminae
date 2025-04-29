import { disableAll } from "./disableAll.js";

import type { ButtonInteraction } from "discord.js";

export const exitButtonHandler = async (interaction: ButtonInteraction<"cached">) => {
  const regex = /^exit-(\d+)$/;
  const match = regex.exec(interaction.customId);
  if (!match) return;
  const userId = match[1];
  if (interaction.user.id !== userId) return;
  if (interaction.message.editable) {
    await interaction.update({ components: disableAll(interaction.message.components) }).catch(() => null);
  }
};
