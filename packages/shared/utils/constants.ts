import { env } from "@misu/api/src/env";

export const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${
	env.DISCORD_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
	env.DISCORD_REDIRECT_URI
)}&response_type=code&scope=identify%20email`;

export const DISCORD_API_URL = "https://discord.com/api";
export const API_URL = "http://localhost:5000/v1";
export const WEB_URL = "http://localhost:3000";
