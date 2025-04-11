import { z } from "zod";

export const userSchema = z.object({
	
});

export type UserSchema = z.infer<typeof userSchema>;
