import { Time } from "@imranbarbhuiya/duration";
import prisma from "@luminae/db";
import {
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";

import { ApplyCommandOption, Command } from "~/structure/Command";
import { Constants } from "~/util/constants";
import { lazyFormattedTime } from "~/util/formatter";
import { authorOrUser } from "~/util/utils";

@ApplyCommandOption(
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the level leaderboard")
    .setContexts(InteractionContextType.Guild),
  {
    usage: "`{p}leaderboard`",
    aliases: ["l", "lb"],
    allowDM: false,
  },
)
export class UserCommand extends Command {
  protected override async runTask(ctx: ChatInputCommandInteraction<"cached"> | Message<true>) {
    const levelLeaderboard = await prisma.guildUser.findMany({
      where: { guildId: ctx.guild.id },
      orderBy: { xp: "desc" },
    });

    const messageLeaderboard = await prisma.guildUser.findMany({
      where: { guildId: ctx.guild.id },
      orderBy: { messages: "desc" },
    });

    const voiceLeaderboard = await prisma.guildUser.findMany({
      where: { guildId: ctx.guild.id },
      orderBy: { voiceTime: "desc" },
    });

    if (!levelLeaderboard.length) {
      return ctx.reply({
        content: "Leaderboard is empty",
      });
    }

    const levelLeaderboardEmbed = new EmbedBuilder()
      .setColor(Constants.primaryColor)
      .setTitle("Level Leaderboard")
      .setDescription(
        levelLeaderboard
          .map((user, i) => {
            return `${i + 1} - <@${user.userId}>\n **Level: ${user.level}**`;
          })
          .join("\n"),
      )
      .setTimestamp()
      .setFooter({
        text: ctx.client.user.username,
        iconURL: ctx.client.user.displayAvatarURL(),
      });

    const messageLeaderboardEmbed = new EmbedBuilder()
      .setColor(Constants.primaryColor)
      .setTitle("Message Leaderboard")
      .setDescription(
        messageLeaderboard
          .map((user, i) => {
            if (user.messages === 0) return null;
            return `${i + 1}. <@${user.userId}> - **${user.messages} messages**`;
          })
          .join("\n"),
      )
      .setTimestamp()
      .setFooter({
        text: ctx.client.user.username,
        iconURL: ctx.client.user.displayAvatarURL(),
      });

    const voiceLeaderboardEmbed = new EmbedBuilder()
      .setColor(Constants.primaryColor)
      .setTitle("Voice Leaderboard")
      .setDescription(
        voiceLeaderboard
          .map((user, i) => {
            if (user.voiceTime === 0) return null;
            return `${i + 1}. <@${user.userId}> - **${lazyFormattedTime(user.voiceTime * 1000)}**`;
          })
          .join("\n"),
      )
      .setTimestamp()
      .setFooter({
        text: ctx.client.user.username,
        iconURL: ctx.client.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("leaderboard")
        .setPlaceholder("Select a leaderboard")
        .addOptions([
          {
            label: "Level Leaderboard",
            value: "level",
          },
          {
            label: "Message Leaderboard",
            value: "message",
          },
          {
            label: "Voice Leaderboard",
            value: "voice",
          },
        ]),
    );

    const reply = await ctx.reply({
      embeds: [levelLeaderboardEmbed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      filter: (i) => i.user.id === authorOrUser(ctx).id,
      idle: 15 * Time.Minute,
      componentType: ComponentType.StringSelect,
    });

    collector.on("collect", async (i) => {
      if (i.customId !== "leaderboard") return;
      if (i.values[0] === "level") {
        await i.update({ embeds: [levelLeaderboardEmbed] });
      } else if (i.values[0] === "message") {
        await i.update({ embeds: [messageLeaderboardEmbed] });
      } else if (i.values[0] === "voice") {
        await i.update({ embeds: [voiceLeaderboardEmbed] });
      }
    });
  }
}
