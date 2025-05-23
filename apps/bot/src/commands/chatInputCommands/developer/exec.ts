import { exec as _exec } from "child_process";
import { performance } from "perf_hooks";
import { promisify } from "util";

import { ApplicationCommandOptionType, EmbedBuilder, type ChatInputCommandInteraction, type Message } from "discord.js";

import { Logger } from "@luminae/shared/utils/logger";
import { Command } from "~/structure/Command";
import { authorOrUser, formatMs, isInteraction } from "~/util/utils";

const exec = promisify(_exec);

export class UserCommand extends Command {
  public constructor() {
    super({
      name: "exec",
      description: "Executes a command in terminal",
      options: [
        {
          name: "command",
          description: "The command to run",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    });

    this.ownerOnly = true;
  }

  protected override async runTask(
    ctx: ChatInputCommandInteraction<"cached"> | Message<true>,
    options: Command.ChatInputOptions,
  ) {
    const user = authorOrUser(ctx);

    if (user.id !== "225176015016558593") return;
    const commandToRun = options.getString("command", true);
    if (!commandToRun) return ctx.reply("Please provide a command to run.");

    if (isInteraction(ctx))
      await ctx.deferReply({
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setTitle("Dynamic CLI command result")
      .setFooter({
        text: `${user.tag}`,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp()
      .addFields({
        name: "Input: ",
        value: `\`\`\`js\n${commandToRun}\n\`\`\``,
      });
    const startTime = performance.now();
    const output = await exec(commandToRun).catch((error: Error) => ({
      stdout: "",
      stderr: "",
      error: error.message,
    }));

    const endTime = performance.now();
    const timeTaken = formatMs(endTime - startTime);
    Logger.customLog("EXEC", output);
    Logger.customLog("EXEC", "Time Taken: ", `${timeTaken}`);

    embed.setFooter({
      text: `⏱️ Time Taken: ${timeTaken}`,
    });

    if (output.stdout)
      embed.addFields({
        name: "stdout: ",
        value: `\`\`\`js\n${output.stdout}\n\`\`\``,
      });
    if (output.stderr)
      embed.addFields({
        name: "stderr: ",
        value: `\`\`\`js\n${output.stderr}\n\`\`\``,
      });
    if ("error" in output)
      embed.addFields({
        name: "Error: ",
        value: `\`\`\`js\n${output.error}\n\`\`\``,
      });

    const payload = {
      embeds: [embed],
    };

    if (isInteraction(ctx)) await ctx.editReply(payload).catch(() => null);
    else await ctx.reply(payload);
  }

  protected override transformArgs(message: Message<true>, args: string[]) {
    const command = args.join(" ");
    if (!command) return "Please provide a command to run.";

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getString(name: string, required?: boolean) {
        if (name === "command") return command;
        return null;
      },
    } as unknown as Command.ChatInputOptions;
  }
}
