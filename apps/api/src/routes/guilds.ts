import { Hono } from "hono";

const guildsRoute = new Hono();

guildsRoute.get("/:guildId", (c) => {
  const guildData = c.req.param("guildId");
  return c.json({ success: true });
});

export default guildsRoute;