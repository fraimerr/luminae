import { Message, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

import { ApplyCommandOption, Command } from "~/structure/Command";
import { formatMs } from "~/util/utils";

@ApplyCommandOption(new SlashCommandBuilder().setName("ping").setDescription("Shows the current latency of the bot"), {
  usage: "`{p}ping`",
  aliases: ["p"],
  allowDM: true,
})
export class UserCommand extends Command {
  protected override async runTask(ctx: ChatInputCommandInteraction<"cached"> | Message<true>) {
    let sent = await ctx.reply({
      content: `🏓 Pong!`,
      fetchReply: true,
    });

    try {
      sent.edit(
        `🏓 Pong! \`|\` Heartbeat : **${formatMs(
          ctx.client.ws.ping,
        )}** \`|\` Roundtrip latency : **${formatMs(sent.createdTimestamp - ctx.createdTimestamp)}**`,
      );
    } catch (e) {}
  }

  protected override transformArgs(message: Message<true>, args: string[]) {
    // Ping command doesn't need any args, so we just return an empty options object
    return {} as Command.ChatInputOptions;
  }
}
