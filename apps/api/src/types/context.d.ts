import type { User } from "@prisma/client";

type ContextUser = Pick<
	User,
	"id" | "discordId" | "username" | "email" | "avatar" | "createdAt" | "accessToken" | "refreshToken" 
>;

export type Variables = {
	sessionId: string;
	user: ContextUser;
};
