import {
  InteractionContextType,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";

import { ApplyCommandOption, Command } from "~/structure/Command";
import { authorOrUser, getMember } from "~/util/utils";
import { RankCard } from "~/manager/leveling/RankCard";
import { getLevelData } from "~/root/database/services/leveling";

@ApplyCommandOption(
  new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get the rank of a user")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option.setName("user").setDescription("User")),
  {
    usage: "`{p}rank`",
    aliases: ["r", "level", "l"],
    allowDM: false,
    args: ["user"],
  },
)
export class UserCommand extends Command {
  protected override async runTask(
    messageOrInteraction: ChatInputCommandInteraction<"cached"> | Message<true>,
    options: Command.ChatInputOptions,
  ) {
    const user = options.getUser("user") || authorOrUser(messageOrInteraction);

    const member = await messageOrInteraction.guild.members.fetch(user.id);

    const levelData = await getLevelData(user.id, messageOrInteraction.guild.id, true);

    if (!levelData) {
      return messageOrInteraction.reply({
        content: "User has no level data",
      });
    }

    const card = await RankCard.getCard(member, levelData);

    await messageOrInteraction.reply({
      files: card,
    });
  }

  protected override transformArgs(message: Message<true>, args: string[]) {
    const member = getMember(message, args.join(",")) ?? message.mentions.members.first() ?? message.member;
    const options: Partial<Command.ChatInputOptions> = {
      getMember: () => member!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      getUser: () => member?.user!,
    };
    return options as Command.ChatInputOptions;
  }
}
