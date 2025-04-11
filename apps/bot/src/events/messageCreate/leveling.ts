import prisma from "@misu/db";
import { Message, TextChannel } from "discord.js";
import { LevelingManager } from "~/manager/leveling/LevelingManager";
import { replaceVariables } from "~/util/replaceVariables";

export default async function (message: Message) {
	if (!message.inGuild()) return;
	if (message.author.bot) return;

	const userId = message.author.id;
	const guildId = message.guild.id;

	const xp = LevelingManager.getRandomXp();

	const LevelingConfig = await prisma.levelingConfig.findUnique({
		where: { guildId },
	});

	const { levelData, levelUp } = await LevelingManager.addXp(
		userId,
		guildId,
		xp
	);

	if (!levelUp) return;

	if (LevelingConfig) {
		const channel = message.guild.channels.cache.get(
			LevelingConfig.channelId!
		) as TextChannel;

		if (!channel) return;

		await channel.send({
			content: replaceVariables(
				`{user.mention} has leveled up to **Level {level}**!`,
				message.member!,
				levelData,
				true
			),
		});
	} else {
		await message.channel.send({
			content: replaceVariables(
				`{user.mention} has leveled up to **Level {level}**!`,
				message.member!,
				levelData,
				true
			),
		});
	}
}
