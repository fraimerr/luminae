import { ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { ApplyCommandOption, Command } from "~/structure/Command";

@ApplyCommandOption(
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Ban a user")
        .addUserOption((option) => option.setName("user").setDescription("The user to ban.").setRequired(true))
        .addStringOption((option) => option.setName("duration").setDescription("The duration of the ban."))
        .addStringOption((option) => option.setName("reason").setDescription("The reason for banning."))
        .addStringOption((option) =>
          option
            .setName("delete-previous-messages")
            .setDescription("Delete messages sent in past...")
            .addChoices(
              { name: "Previous hour", value: "1h" },
              { name: "Previous 6 hours", value: "6h" },
              { name: "Previous 12 hours", value: "12h" },
              { name: "Previous 24 hours", value: "24h" },
              { name: "Previous 3 days", value: "3d" },
              { name: "Previous 7 days", value: "7d" },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Unban a user")
        .addUserOption((option) => option.setName("user").setDescription("The user to unban.").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("The reason for unbanning.")),
    ),
)
export class UserCommand extends Command {
  protected override async runTask(
    messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message<true>,
    options: Command.ChatInputOptions,
  ) {}
}
