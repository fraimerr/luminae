import { cyan, cyanBright } from "colorette";
import { ActivityType, Client } from "discord.js";
import figlet from "figlet";
import gradient from "gradient-string";
import { Logger } from "@misu/shared/utils/logger";
import { syncCommands } from "~/util/syncCommand";

export default async function (client: Client<true>) {
	const pad = " ".repeat(2);

	console.log(
		`${gradient.pastel.multiline(figlet.textSync("M I	S U"))}
      ${pad}${
			cyan("V ") +
			cyanBright(
				(require("../../../package.json") as { version: string }).version
			)
		}`
	);

	Logger.info(`├─ Loaded ${client.chatInputCommands.size} ChatInput Commands`);
	Logger.info(
		`├─ Loaded ${client.contextmenuCommands.size} ContextMenu Commands`
	);
	Logger.info(`├─ Loaded ${client.helpCommands.size} Helper Commands`);
	Logger.info("├─ Loaded All Events");
	Logger.info("└─ Loaded all giveaway events");

	Logger.log(`Logged in as ${client.user.tag}.`);
	Logger.log(
		`Ready on ${(
			await client.cluster?.broadcastEval((c: Client) => c.guilds.cache.size)
		)?.reduce((a: any, b: any) => a + b)} servers.`
	);

	await syncCommands(client);

	client.user.setActivity(`mizu help`, {
		type: ActivityType.Listening as number,
	});
}
