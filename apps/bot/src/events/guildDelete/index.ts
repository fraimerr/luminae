import prisma from "@luminae/db";
import type { ClientEvents } from "~/types/events";

const guildDelete: ClientEvents["GuildDelete"] = async (guild) => {
  await prisma.guilds.delete({ where: { guildId: guild.id } });
};

export default guildDelete;
