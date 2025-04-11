import prisma from "@misu/db";
import { Logger } from "@misu/shared/utils/logger";
import { client } from "~/root/main";

export const getUser = async (userId: string) => {
	try {
		const data = await prisma.users.findUnique({
			where: { discordId: userId },
		});
		return data;
	} catch (error) {
		Logger.error("Error fetching user:", error);
		throw new Error("Failed to retrieve user");
	}
};

export const createUser = async (userId: string) => {
	try {
		const existingUser = await prisma.users.findUnique({
			where: { discordId: userId },
		});

		if (existingUser) return;

		const fetchUser = await client.users.fetch(userId);

		if (!fetchUser) throw new Error("User not found");

		const data = await prisma.users.create({
			data: {
				discordId: fetchUser.id,
				username: fetchUser.username,
				email: "",
				avatar: fetchUser.avatar,
				color: {},
				background: {},
			},
		});
		return data;
	} catch (error) {
		Logger.error("Error creating user:", error);
		throw new Error("Failed to create user");
	}
};

export const getOrCreateUser = async (userId: string) => {
	try {
		let data = await prisma.users.findUnique({
			where: { discordId: userId },
		});

		if (!data) {
			const fetchUser = await client.users.fetch(userId);
			data = await prisma.users.create({
				data: {
					discordId: fetchUser.id,
					username: fetchUser.username,
					email: "",
					avatar: fetchUser.avatar,
					color: {
						accent: fetchUser.accentColor,
					},
					background: {},
				},
			});
		}

		return data;
	} catch (error) {
		Logger.error("Error getting/creating user:", error);
		throw new Error("Failed to get or create user");
	}
};
