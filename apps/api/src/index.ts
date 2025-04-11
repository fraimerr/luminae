import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";
import path from "path";
import { readdirSync } from "fs";
import { type Variables } from "./types/context";
import { Logger } from "@misu/shared/utils/logger";

const app = new Hono<{ Variables: Variables }>().basePath("/v1");

app
	.use(logger())
	.use(secureHeaders())
	.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
		})
	)
	.use(
		rateLimiter({
			windowMs: 60 * 1000,
			limit: 1000,
			keyGenerator: (_c) => "global",
		})
	);
const routesPath = path.join(__dirname, "routes");
const routeFiles = readdirSync(routesPath).filter((file) =>
	file.endsWith(".ts")
);

routeFiles.forEach((file) => {
	const routeName = file.split(".")[0];
	const router = require(path.join(routesPath, file)).default;
	app.route(routeName, router);
	Logger.customLog("[ROUTE]", `Route loaded: ${routeName}`);
});

app.get("/", (c: Context) => c.text("💙"));

export default {
	fetch: app.fetch,
	port: 5000,
};
