import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Variables } from "../types/context";
import prisma from "@luminae/db";
import { z } from "zod";
import { getBotGuilds, getUserGuilds } from "../utils/discord";
import { APIGuild } from "discord-api-types/v10";
import { env } from "../env";
import { Logger } from "@luminae/shared/utils/logger";
import { Guild } from "@luminae/types";

const usersRoute = new Hono<{ Variables: Variables }>();

usersRoute.get("/@me", authMiddleware, async (c) => {
	const user = c.get("user");

	const userData = await prisma.users.findUnique({
		where: { discordId: user.discordId },
	});

	return c.json({ success: true, user: userData });
});

usersRoute.get("/@me/guilds", authMiddleware, async (c) => {
	const user = c.get("user");

	console.log("User:", user.accessToken);

	try {
		const guilds = await getUserGuilds(user.accessToken);

		const MANAGE_GUILD_PERMISSION = BigInt(0x20);
		const ADMINISTRATOR_PERMISSION = BigInt(0x8);

		const managedGuilds = guilds.filter((guild: APIGuild) => {
			const permissions = BigInt(guild.permissions || 0);
			return Boolean(
				(permissions & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION ||
					(permissions & ADMINISTRATOR_PERMISSION) === ADMINISTRATOR_PERMISSION
			);
		});

		console.log("Managed Guilds:", managedGuilds);
		const botGuilds = await getBotGuilds(env.DISCORD_BOT_TOKEN);
		console.log("Bot Guilds:", botGuilds);

		const botGuildIds = new Set(botGuilds.map((guild: APIGuild) => guild.id));

		const guildsRes: Guild[] = managedGuilds.map((guild: APIGuild) => ({
			id: guild.id,
			name: guild.name,
			icon: guild.icon,
			botPresent: botGuildIds.has(guild.id),
		}));

		return c.json(
			{
				success: true,
				message: "Guilds fetched successfully",
				data: guildsRes,
			},
			200
		);
	} catch (err) {
		Logger.error("Error fetching user guilds:" + err);
		return c.json({ success: false, message: "Internal server error" }, 500);
	}
});

usersRoute.post("/@me/rank", authMiddleware, async (c) => {
	const user = c.get("user");

	const userData = await prisma.users.findUnique({
		where: { discordId: user.discordId },
	});
});

export default usersRoute;
