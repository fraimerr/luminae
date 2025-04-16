import {
	DISCORD_OAUTH_URL,
	DISCORD_API_URL,
	WEB_URL,
} from "@parallel/shared/utils/constants";
import { env } from "../env";
import { Hono, type Context } from "hono";
import prisma from "@parallel/db";
import { setCookie } from "hono/cookie";
import { SessionManager } from "../services/session";
import type { Variables } from "../types/context";
import { APIUser } from "discord-api-types/v10";

const authRoute = new Hono<{ Variables: Variables }>();

const sessionManager = new SessionManager();

authRoute.get("/login", (c: Context) => {
	return c.redirect(DISCORD_OAUTH_URL);
});

authRoute.get("/callback", async (c: Context) => {
	const code = c.req.query("code");

	if (!code || typeof code !== "string") {
		return c.json(
			{
				success: false,
				message: "Missing code",
			},
			400
		);
	}

	const params = new URLSearchParams({
		client_id: env.DISCORD_CLIENT_ID,
		client_secret: env.DISCORD_CLIENT_SECRET,
		grant_type: "authorization_code",
		code,
		redirect_uri: env.DISCORD_REDIRECT_URI,
	});

	const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
	});

	if (!response.ok) {
		return c.json(
			{
				success: false,
				message: "Failed to fetch access token",
			},
			400
		);
	}

	const data = await response.json();

	const fetchUser = await fetch(`${DISCORD_API_URL}/users/@me`, {
		headers: {
			Authorization: `Bearer ${data.access_token}`,
		},
	});

	if (!fetchUser) {
		return c.json(
			{
				success: false,
				message: "Failed to fetch user",
			},
			400
		);
	}

	const user = (await fetchUser.json()) as APIUser;

	let updateOrCreateUser = await prisma.users.upsert({
		where: { discordId: user.id },
		create: {
			discordId: user.id,
			username: user.username,
			avatar: user.avatar,
			banner: user.banner,
			email: user.email,
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
		},
		update: {
			discordId: user.id,
			username: user.username,
			avatar: user.avatar,
			banner: user.banner,
			email: user.email,
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
		},
	});

	if (!updateOrCreateUser) {
		return c.json(
			{
				success: false,
				message: "Failed to update or create user",
			},
			400
		);
	}

	const token = await sessionManager.create(updateOrCreateUser.id);

	setCookie(c, "token", token, {
		sameSite: "lax",
		maxAge: 24 * 60 * 60,
		path: "/",
	});

	return c.redirect(WEB_URL);
});

export default authRoute;
