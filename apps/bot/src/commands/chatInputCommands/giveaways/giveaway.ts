import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { ChatInputCommand } from "~/structure/ChatInputCommand";
import giveawayCreate from "./subcommands/create";

export class UserCommand extends ChatInputCommand {
  public constructor() {
    super({
      name: "giveaway",
      description: "Giveaways commands",
      options: [
        {
          name: "create",
          description: "Create a giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "title",
              description: "The title of the giveaway",
              required: true,
              type: ApplicationCommandOptionType.String,
            },
            {
              name: "duration",
              description: "The duration of the giveaway",
              required: true,
              type: ApplicationCommandOptionType.String,
            },
            {
              name: "description",
              description: "The description of the giveaway",
              required: false,
              type: ApplicationCommandOptionType.String,
            },
            {
              name: "winners",
              description: "The number of winners",
              required: false,
              type: ApplicationCommandOptionType.Integer,
            },
            {
              name: "channel",
              description: "The channel where the giveaway will be created",
              required: false,
              type: ApplicationCommandOptionType.Channel,
            },
          ],
        },
        {
          name: "delete",
          description: "Delete a specific giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "message_id",
              description: "The message Id of the giveaway",
              required: true,
              type: ApplicationCommandOptionType.String,
            },
          ],
        },
        {
          name: "edit",
          description: "Edit a specific giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "end",
          description: "End a specific giveaway early",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "list",
          description: "List all giveaways in the server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "pause",
          description: "Pause a specific giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "reroll",
          description: "Reroll a giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
        {
          name: "resume",
          description: "Resume a specific giveaway",
          type: ApplicationCommandOptionType.Subcommand,
          options: [],
        },
      ],
    });
  }
  protected override async runTask(interaction: ChatInputCommandInteraction<"cached">) {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand === "create") {
      await giveawayCreate(interaction, interaction.options);
    } else if (subCommand === "delete") {
    } else if (subCommand === "edit") {
    } else if (subCommand === "pause") {
    } else if (subCommand === "end") {
    } else if (subCommand === "reroll") {
    } else if (subCommand === "resume") {
    }
  }
}
