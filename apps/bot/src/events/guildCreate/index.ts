import prisma from "@zcro/db";
import { Guild } from "discord.js";

export default async function (guild: Guild) {
	const data = await prisma.guilds.create({ data: { guildId: guild.id } });
	if (data) return;
	await prisma.guilds.create({
		data: {
			guildId: guild.id,
			prefixes: ["mu"],
		},
	});
}
