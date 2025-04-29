import { ApplicationCommandType, EmbedBuilder } from "discord.js";

import type { ContextMenuUserCommand } from "~/types/command";

import { Constants } from "~/util/constants";

export const command: ContextMenuUserCommand = {
  name: "avatar",
  type: ApplicationCommandType.User,
  allowDM: true,
  async runTask(interaction) {
    const member = interaction.targetMember;
    const user = interaction.targetUser;
    const embed = new EmbedBuilder()
      .setColor(Constants.primaryColor)
      .setTitle("Avatar")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setImage(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (member ?? user).displayAvatarURL({
          size: 1_024,
        }),
      );
    return interaction.reply({ embeds: [embed] });
  },
};
