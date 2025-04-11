import "dotenv/config";
import { env } from "./env";
import { ClusterManager } from "discord-hybrid-sharding";
import { ChildProcess } from "child_process";
import { Logger } from "@misu/shared/utils/logger";

const isProductionMode = process.env.NODE_ENV === "production";

const startupOptions = !isProductionMode
	? {
			totalShards: 1,
			shardsPerClusters: 1,
	  }
	: { totalShards: 32, shardsPerClusters: 8 };

const manager = new ClusterManager("./src/main.ts", {
	...startupOptions,
	execArgv: ["--trace-warnings", "--enable-source-maps"],
	mode: "process",
	token: env.BOT_TOKEN,
});

manager.on("clusterCreate", (cluster) => {
	cluster.on(
		"spawn",
		(child) =>
			void (child as ChildProcess).send({ job: "ready", value: cluster.id })
	);
	cluster.on("death", () => Logger.warn(`${cluster.id} has died`));
	cluster.on("error", (err) => Logger.error(err));
});

manager
	.spawn({ timeout: 10 * 1000 })
	.then(() => {
		Logger.info("All Shards ready");
	})
	.catch((error) => Logger.error(error));
