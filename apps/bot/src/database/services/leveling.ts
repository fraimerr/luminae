import prisma from "@misu/db";
import { Leveling } from "@prisma/client";

type funcType = (
	userId: string,
	guildId: string,
	getRank?: boolean
) => Promise<Leveling>;

export const getOrCreateLevelData: funcType = async (
	userId,
	guildId,
	getRank
) => {
	let data =
		(await prisma.leveling.findUnique({
			where: { userId_guildId: { userId, guildId } },
		})) ??
		(await prisma.leveling.create({
			data: {
				userId,
				guildId,
				streak: 0,
				xp: 0,
				textXp: 0,
				voiceXp: 0,
				level: 0,
				messages: 0,
				lastUpdate: new Date(),
				lastText: new Date(),
				lastVoice: new Date(),
				rank: 0,
			},
		}));

	if (getRank) {
		const levelingData = await prisma.leveling.findMany({
			where: { guildId },
			orderBy: { xp: "desc" },
		});

		const index = levelingData.findIndex((i) => i.userId === userId);
		data.rank = index + 1 || 0;
	}

	return data;
};

export const getLevelData: funcType = async (userId, guildId, getRank) => {
	const data = await prisma.leveling.findUnique({
		where: { userId_guildId: { userId, guildId } },
	});

	if (getRank) {
		const index = (
			await prisma.leveling.findMany({
				where: { guildId },
				orderBy: { xp: "desc" },
			})
		).findIndex((i) => i.userId === userId);
		data!.rank = index + 1 || 0;
	}

	return data!;
};

export const updateLevelData = async (
	userId: string,
	guildId: string,
	data: Partial<Leveling>
) => {
	return await prisma.leveling.update({
		where: { userId_guildId: { userId, guildId } },
		data,
	});
};
