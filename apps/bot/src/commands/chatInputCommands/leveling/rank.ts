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
	}
)
export class UserCommand extends Command {
	protected override async runTask(
		ctx: ChatInputCommandInteraction<"cached"> | Message<true>,
		options: Command.ChatInputOptions
	) {
		const user = options.getUser("user") || authorOrUser(ctx);

		const member = await ctx.guild.members.fetch(user.id);

		const levelData = await getLevelData(
			user.id,
			ctx.guild.id,
			true
		);

		if (!levelData) {
			return ctx.reply({
				content: "User has no level data",
			});
		}

		const card = await RankCard.getCard(member, levelData);

		await ctx.reply({
			files: card,
		});
	}

	protected override transformArgs(message: Message<true>, args: string[]) {
		const member =
			getMember(message, args.join(" ")) ?? message.mentions.members.first();

		const options: Partial<Command.ChatInputOptions> = {
			getUser: () => member?.user!,
		};

		return options as Command.ChatInputOptions;
	}
}
