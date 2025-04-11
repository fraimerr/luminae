import { z } from "zod";

const envSchema = z.object({
	API_URL: z.string(),
	BOT_TOKEN: z.string()
});

export const env = envSchema.parse(process.env);
