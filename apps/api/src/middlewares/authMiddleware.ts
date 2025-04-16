import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { SessionManager } from "../services/session";
import prisma from "@parallel/db";

const sessionManager = new SessionManager();

export const authMiddleware = async (c: Context, next: Next) => {
	try {
		const cookieToken = getCookie(c, "token");
		const authHeader = c.req.header("Authorization");
		const authHeaderToken = authHeader?.startsWith("Bearer ")
			? authHeader.substring(7)
			: null;
		const token = cookieToken || authHeaderToken;

		if (!token) {
			return c.json(
				{
					success: false,
					message: "Authentication required",
				},
				401
			);
		}

		const session = await sessionManager.validate(token);

		const user = await prisma.users.findUnique({
			where: { id: session!.userId as string },
		});

		c.set("sessionId", session!.sessionId);
		c.set("user", user);

		await next();
	} catch (error) {
		await c.redirect("/auth/login");
		return c.json(
			{
				success: false,
				message: "Invalid session or session expired!",
			},
			401
		);
	}
};
