

export const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=1349495395822211134&redirect_uri=${encodeURIComponent(
	"http://localhost:5000/v1/auth/callback"
)}&response_type=code&scope=identify%20email%20guilds`;

export const DISCORD_API_URL = "https://discord.com/api";
export const API_URL = "http://localhost:5000/v1";
export const WEB_URL = "http://localhost:3000";

export const SUPPORT_SERVER = "https://discord.gg/dCHKjsmNMS";

export const OWNER_ID = "225176015016558593";

export const BETA_TESTERS = ["225176015016558593"];

export const PRIMARY_COLOR = 0xd097af;
