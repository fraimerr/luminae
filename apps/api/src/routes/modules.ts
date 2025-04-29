import { Hono } from "hono";
import prisma from "@luminae/db";

const modulesRoute = new Hono();

modulesRoute.get("/:guildId", async (c) => {
	const guildId = c.req.param("guildId");

	try {
		const guildData = await prisma.guilds.findUnique({
			where: { guildId },
		});

		if (!guildData) {
			return c.json(
				{
					success: false,
					message: "Guild not found",
				},
				404
			);
		}

		const modules = {
			leveling: prisma.levelingConfig,
			giveaways: prisma.giveawaysConfig,
			achievements: prisma.achievements,
		};

		const modulesData = await Promise.all(
			Object.keys(modules).map(async (module) => {
				const moduleConfig = modules[module as keyof typeof modules];
				//@ts-ignore
				const config = await moduleConfig.findUnique({
					where: { guildId },
				});
				return {
					name: module,
					enabled: config?.enabled || false,
				};
			})
		);

		return c.json({
			success: true,
			message: "Modules data fetched successfully",
			data: modulesData,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				message: "Error fetching modules data",
			},
			500
		);
	}
});

modulesRoute.post("/:guildId/:module", async (c) => {
	const { guildId, module } = c.req.param();
	const body = await c.req.json();

	const { enabled } = body;

	if (enabled === undefined || typeof enabled !== "boolean") {
		return c.json(
			{
				success: false,
				message: "Invalid enabled state provided",
			},
			400
		);
	}

	try {
		const guildData = await prisma.guilds.findUnique({
			where: { guildId },
		});

		if (!guildData) {
			return c.json(
				{
					success: false,
					message: "Guild not found",
				},
				404
			);
		}

		let result;

		const modules = {
			leveling: prisma.levelingConfig,
			giveaways: prisma.giveawaysConfig,
			achievements: prisma.achievements,
		};

		const moduleConfig = modules[module as keyof typeof modules];

		if (!moduleConfig) {
			return c.json(
				{
					success: false,
					message: "Module not found",
				},
				404
			);
		}

		//@ts-ignore
		result = await moduleConfig.upsert({
			where: { guildId },
			update: {
				enabled,
			},
			create: {
				guildId,
				enabled,
			},
		});

		return c.json(
			{
				success: true,
				message: `Module ${module} ${
					enabled ? "enabled" : "disabled"
				} successfully`,
				data: result,
			},
			200
		);
	} catch (error) {
		return c.json(
			{
				success: false,
				message: "Failed to update module",
				error: (error as Error).message,
			},
			500
		);
	}
});

export default modulesRoute;
