import { readdirSync } from "fs";
import type { Client } from "discord.js";
import { Logger } from "@misu/shared/utils/logger";

export const handler = (client: Client) => {
	const path = `${__dirname}/../events`;

	const eventsFolders = readdirSync(path, { withFileTypes: true })
		.filter((dir) => dir.isDirectory())
		.map((dir) => dir.name);

	for (const eventName of eventsFolders) {
		const eventPath = `${path}/${eventName}`;

		const eventFiles = readdirSync(eventPath).filter((file) =>
			file.endsWith(".ts")
		);

		for (const file of eventFiles) {
			const filePath = `${eventPath}/${file}`;

			try {
				const { default: run } = require(filePath);

				if (typeof run !== "function") {
					Logger.error(
						`File ${filePath} of event ${eventName} does not export a function!`
					);
					continue;
				}

				client.on(eventName, run);

				delete require.cache[require.resolve(filePath)];
			} catch (err) {
				Logger.error(
					`Error loading event ${eventName} from ${filePath}: ${err}`
				);
			}
		}
	}
};
