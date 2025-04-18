import { Hono } from "hono";
import prisma from "packages/db/src";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getGuildChannels } from "../utils/discord";

const guildsRoute = new Hono();

guildsRoute.get("/:guildId", authMiddleware, async (c) => {
	const guildId = c.req.param("guildId");

	const guildData = await prisma.guilds.findUnique({
		where: { guildId },
	});

	return c.json({
		success: true,
		message: "Guild data fetched successfully",
		data: guildData,
	});
});

guildsRoute.get("/:guildId/channels", authMiddleware, async (c) => {
	const guildId = c.req.param("guildId");

	const channels = await getGuildChannels(guildId);

	if (!channels) {
		return c.json({
			success: false,
			message: "Guild or Channels not found",
		});
	}

	return c.json({
		success: true,
		message: "",
		data: channels,
	});
});

guildsRoute.get("/:guildId/roles", authMiddleware, async (c) => {});

export default guildsRoute;
