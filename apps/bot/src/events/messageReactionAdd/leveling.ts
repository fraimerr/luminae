import prisma from "@parallel/db";
import { MessageReaction, TextChannel, User } from "discord.js";
import { LevelingManager } from "~/manager/leveling/LevelingManager";
import { replaceVariables } from "~/util/replaceVariables";

export default async function (reaction: MessageReaction, user: User) {
	if (user.bot) return;
	if (!reaction.message.inGuild()) return;

	const userId = user.id;
	const guildId = reaction.message.guild.id;

	const xp = LevelingManager.getRandomXp();

	const LevelingConfig = await prisma.levelingConfig.findUnique({
		where: { guildId },
	});

	const { levelData, levelUp } = await LevelingManager.addXp(
		userId,
		guildId,
		xp
	);

	console.log("Added xp: ", xp);

	if (!levelUp) return;

	if (LevelingConfig) {
		const channel = reaction.message.guild.channels.cache.get(
			LevelingConfig.channelId!
		) as TextChannel;

		if (!channel) return;

		await channel.send({
			content: replaceVariables(
				`{user.mention} has leveled up to **Level {level}**!`,
				reaction.message.member!,
				levelData,
				true
			),
		});
	} else {
		await reaction.message.channel.send({
			content: replaceVariables(
				`{user.mention} has leveled up to **Level {level}**!`,
				reaction.message.member!,
				levelData,
				true
			),
		});
	}
}
