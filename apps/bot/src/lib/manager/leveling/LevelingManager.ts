import prisma from "@parallel/db";
import { Leveling, LevelingConfig } from "@prisma/client";
import { GuildMember, Message } from "discord.js";
import {
	getLevelData,
	getOrCreateLevelData,
} from "~/root/database/services/leveling";
import { replaceVariables } from "~/util/replaceVariables";

export class LevelingManager {
	public static async levelUp(
		message: Message,
		member: GuildMember,
		levelData: Leveling,
		config: LevelingConfig
	) {
		if (config.channelId) {
			let content =
				config.message || "{user.mention} has leveled up to **Level {level}**!";
			content = replaceVariables(content, member, levelData, false);

			const channel = member.guild.channels.cache.get(config.channelId);

			if (channel && channel?.isTextBased()) {
				channel.send(content);
			} else {
				message.reply(content);
			}
		}
	}

	public static async addLevel(userId: string, guildId: string) {
		return await prisma.leveling.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				level: { increment: 1 },
				xp: {
					increment: LevelingManager.getXp(1),
				},
				lastUpdate: new Date(),
			},
		});
	}

	public static async removeLevel(userId: string, guildId: string) {
		return await prisma.leveling.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				level: { decrement: 1 },
				xp: {
					decrement: this.getXp(1),
				},
				lastUpdate: new Date(),
			},
		});
	}

	public static getLevel(xp: number) {
		return Math.floor(0.1 * Math.sqrt(xp));
	}

	public static async addXp(userId: string, guildId: string, xp: number) {
		let levelData = await getOrCreateLevelData(userId, guildId, false);

		const currentLevel = levelData.level;

		levelData = await prisma.leveling.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				xp: {
					increment: xp,
				},
				level: this.getLevel(levelData.xp + xp),

				lastUpdate: new Date(),
			},
		});

		const levelUp = levelData.level > currentLevel ? true : false;

		return { levelData, levelUp };
	}

	public static async removeXp(userId: string, guildId: string, xp: number) {
		const levelData = await getLevelData(userId, guildId);

		if (xp > levelData.xp) {
			return await prisma.leveling.delete({
				where: { userId_guildId: { userId, guildId } },
			});
		}

		return await prisma.leveling.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				xp: {
					decrement: xp,
				},
				level: this.getLevel(levelData.xp - xp),
				lastUpdate: new Date(),
			},
		});
	}

	public static setXp(userId: string, guildId: string, xp: number) {
		return prisma.leveling.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				xp: xp,
				level: this.getLevel(xp),
				lastUpdate: new Date(),
			},
		});
	}

	public static getXp(level: number) {
		return level * level * 100;
	}

	public static getRandomXp(min?: number, max?: number) {
		return Math.round(Math.random() * ((max ?? 15) - (min ?? 5))) + (min ?? 5);
	}
}
