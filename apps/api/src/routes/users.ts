import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Variables } from "../types/context";
import prisma from "@zcro/db";
import { z } from "zod";

const usersRoute = new Hono<{ Variables: Variables }>();

usersRoute.get("/@me", authMiddleware, async (c) => {
	const user = c.get("user");

	const userData = await prisma.users.findUnique({
		where: { discordId: user.discordId },
	});

	return c.json({ success: true, user: userData });
});

usersRoute.post("/@me/rank", authMiddleware, async (c) => {
	const user = c.get("user");

	const userData = await prisma.users.findUnique({
		where: { discordId: user.discordId },
	});
});

export default usersRoute;
