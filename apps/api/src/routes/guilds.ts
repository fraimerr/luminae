import { Hono } from "hono";
import prisma from "packages/db/src";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getGuildChannels } from "../utils/discord";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const guildsRoute = new Hono();

guildsRoute.get("/:guildId", authMiddleware, async (c) => {
  const guildId = c.req.param("guildId");

  const guildData = await prisma.guilds.findUnique({
    where: { guildId },
  });

  return c.json({
    success: true,
    message: "Guild data fetched successfully",
    data: guildData,
  });
});

guildsRoute.get("/:guildId/channels", authMiddleware, async (c) => {
  const guildId = c.req.param("guildId");

  const channels = await getGuildChannels(guildId);

  if (!channels) {
    return c.json({
      success: false,
      message: "Guild or Channels not found",
    });
  }

  return c.json({
    success: true,
    message: "",
    data: channels,
  });
});

guildsRoute.get("/:guildId/roles", authMiddleware, async (c) => {});

guildsRoute.get("/:guildId/config/leveling", authMiddleware, async (c) => {
  const guildId = c.req.param("guildId");

  const levelingData = await prisma.levelingConfig.findUnique({
    where: { guildId },
  });

  if (!levelingData) {
    return c.json({
      success: false,
      message: "Leveling config not found",
    });
  }

  return c.json({
    success: true,
    message: "Leveling config fetched successfully",
    data: levelingData,
  });
});

guildsRoute.patch(
  "/:guildId/config/leveling",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      enabled: z.boolean().optional(),
      announce: z.boolean().optional(),
      channelId: z.string().optional(),
      message: z.string().default("{user.mention} has successfully reached **Level {level}**!").optional(),
    }),
  ),
  async (c) => {
    const guildId = c.req.param("guildId");
    const { enabled, announce, channelId, message } = c.req.valid("json");

    const levelingData = await prisma.levelingConfig.upsert({
      where: { guildId },
      update: {
        enabled,
        announce,
        channelId,
        message,
      },
      create: {
        guildId,
        enabled,
        announce,
        channelId,
        message,
      },
    });

    if (!levelingData) {
      return c.json(
        {
          success: false,
          message: "Leveling config not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Leveling config fetched successfully",
      data: levelingData,
    });
  },
);

export default guildsRoute;
