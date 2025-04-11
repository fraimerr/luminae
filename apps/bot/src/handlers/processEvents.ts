// importing logger
import process from "node:process";

import type { Client } from "discord.js";

export const handler = (client: Client<true>) => {
	process.on("unhandledRejection", (error: Error) => {
		console.log(error, "Unhandled Promise Rejection");
	});
	process.on("uncaughtException", (error) => {
		console.log(error, "Uncaught Exception");
	});

	process.on("uncaughtExceptionMonitor", (error) => {
		console.log(error, "Uncaught Exception Monitor");
	});

	process.on("SIGINT", async () => {
		console.log("SIGINT Received, shutting down...");
		process.exit(0);
	});
	process.on("SIGTERM", async () => {
		console.log("SIGTERM Received, shutting down...");
		process.exit(0);
	});
};
