import type {
  APIGuild,
  RESTPostOAuth2AccessTokenResult,
  APIUser,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { env } from "../env";

const DISCORD_API_URL = "https://discord.com/api";

export const exchangeCode = async (code: string): Promise<RESTPostOAuth2AccessTokenResult> => {
  try {
    const params = new URLSearchParams({
      client_id: Bun.env.DISCORD_CLIENT_ID!,
      client_secret: Bun.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: Bun.env.DISCORD_REDIRECT_URI!,
    });

    const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    return (await response.json()) as RESTPostOAuth2AccessTokenResult;
  } catch (err) {
    throw new Error(`Failed to exchange code: ${err}`);
  }
};

export const getDiscordUser = async (accessToken: string): Promise<APIUser> => {
  const response = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return (await response.json()) as APIUser;
};

export async function getUserGuilds(accessToken: string): Promise<APIGuild[]> {
  const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as APIGuild[];
}

export const getBotGuilds = async (botToken: string): Promise<APIGuild[]> => {
  const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bot guilds");
  }

  return response.json() as Promise<APIGuild[]>;
};

export const refreshToken = async (refresh_token: string): Promise<RESTPostOAuth2AccessTokenResult> => {
  const params = new URLSearchParams({
    client_id: Bun.env.DISCORD_CLIENT_ID!,
    client_secret: Bun.env.DISCORD_CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token,
  });

  const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: params,
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to refresh token: ${error}`);
  }

  return (await response.json()) as RESTPostOAuth2AccessTokenResult;
};

export const getGuild = async (guildId: string): Promise<APIGuild> => {
  const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guild data");
  }

  return (await response.json()) as APIGuild;
};

export const getGuildChannels = async (guildId: string): Promise<RESTGetAPIGuildChannelsResult> => {
  const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guild channels");
  }

  return (await response.json()) as RESTGetAPIGuildChannelsResult;
};

export const getGuildRoles = async (guildId: string): Promise<RESTGetAPIGuildRolesResult> => {
  const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/roles`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guild roles");
  }

  return (await response.json()) as RESTGetAPIGuildRolesResult;
};
