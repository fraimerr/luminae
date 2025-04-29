import prisma from "@luminae/db";
import { Message } from "discord.js";

export default async function (message: Message) {
  if (!message.inGuild()) return;
  if (message.author.bot) return;

  await prisma.guildUser.updateMany({
    where: { userId: message.author.id, guildId: message.guild.id },
    data: { messages: { increment: 1 } },
  });
}
