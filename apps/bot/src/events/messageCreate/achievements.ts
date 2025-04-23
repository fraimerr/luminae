import { ChannelType, Message } from "discord.js";
import { AchievementCard } from "~/manager/achievements/AchievementCard";
import prisma from "@parallel/db";

export default async function (message: Message) {
	if (message.author.bot) return;
	if (!message.inGuild()) return;
	if (message.channel.type !== ChannelType.GuildText) return;

	const achievements = await prisma.achievements.findUnique({
		where: { guildId: message.guild.id },
	});

	if (!achievements || achievements.enabled === false) return;

	const achievementCard = await AchievementCard.create(message.member!);

	await message.channel.send({
		files: achievementCard,
	});
}
