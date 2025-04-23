import prisma from "@parallel/db";
import { Message, TextChannel } from "discord.js";
import { LevelingManager } from "~/manager/leveling/LevelingManager";
import { replaceVariables } from "~/util/replaceVariables";

export default async function (message: Message) {
	if (!message.inGuild()) return;
	if (message.author.bot) return;

	const userId = message.author.id;
	const guildId = message.guild.id;

	const levelingConfig = await prisma.levelingConfig.findUnique({
		where: { guildId },
	});

	if (!levelingConfig || levelingConfig.enabled === false) return;

	const xp = LevelingManager.getRandomXp();

	const { levelData, levelUp } = await LevelingManager.addXp(
		userId,
		guildId,
		xp
	);

	if (!levelUp) return;

	if (levelingConfig.announce === false) return;

	const channel = message.guild.channels.cache.get(
		levelingConfig.channelId!
	) as TextChannel;

	if (channel) {
		await channel.send({
			content: replaceVariables(
				levelingConfig.message!,
				message.member!,
				levelData,
				true
			),
		});
	} else {
		await message.channel.send({
			content: replaceVariables(
				levelingConfig.message!,
				message.member!,
				levelData,
				true
			),
		});
	}
}
