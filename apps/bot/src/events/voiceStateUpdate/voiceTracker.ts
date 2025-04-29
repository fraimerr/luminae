import prisma from "@luminae/db";
import { Collection, VoiceState } from "discord.js";

const voiceTime: Collection<string, number> = new Collection();
const updateIntervals: Collection<string, NodeJS.Timeout> = new Collection();

export default async function (oldState: VoiceState, newState: VoiceState) {
  if (oldState.member?.user.bot) return;

  const guildId = oldState.guild.id;
  const userId = oldState.member?.user.id ?? newState.member?.user.id;

  if (!userId) return;

  if (!oldState.channelId && newState.channelId) {
    console.log("Joined voice channel, time started", newState.channelId);

    const startTime = new Date().getTime().valueOf();
    voiceTime.set(userId, startTime);

    const intervalId = setInterval(async () => {
      const duration = Math.floor((Date.now() - voiceTime.get(userId)!) / 1000);
      voiceTime.set(userId, Date.now());

      await prisma.guildUser.update({
        where: { userId_guildId: { userId, guildId } },
        data: {
          voiceTime: {
            increment: duration,
          },
          lastVoice: new Date(),
        },
      });

      console.log(`Updated voice time for ${userId} - ${duration} seconds`);
    }, 60000);

    updateIntervals.set(userId, intervalId);
  }

  if (oldState.channelId && !newState.channelId) {
    const time = voiceTime.get(userId);
    if (time) {
      const duration = Math.floor((Date.now() - time) / 1000);
      voiceTime.delete(userId);

      if (updateIntervals.has(userId)) {
        clearInterval(updateIntervals.get(userId));
        updateIntervals.delete(userId);
      }

      await prisma.guildUser.update({
        where: { userId_guildId: { userId, guildId } },
        data: {
          voiceTime: {
            increment: duration,
          },
          lastVoice: new Date(),
        },
      });

      console.log(`${newState.member?.user.username} left voice channel ${newState.channelId} for ${duration} seconds`);
    }
  }
}
