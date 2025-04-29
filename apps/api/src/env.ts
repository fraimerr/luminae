import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_REDIRECT_URI: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
