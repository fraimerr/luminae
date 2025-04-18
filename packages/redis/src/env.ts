import { z } from "zod";

const envSchema = z.object({
	REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);
