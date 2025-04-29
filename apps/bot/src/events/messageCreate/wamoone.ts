import { Message } from "discord.js";

export default async function (message: Message) {
  if (!message.inGuild()) return;
  if (message.author.bot) return;

  const raw = JSON.stringify({
    user: {
      id: message.author.id,
    },
    messagelength: 10,
    totalxp: 50,
    multipliers: [{ multiplier: 1.0 }],
    cooldown: 3000,
  });

  const response = await fetch("https://api.wamoone.com/v6/dev/main/level", {
    method: "POST",
    headers: {
      Authorization: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      "Content-Type": "application/json",
    },
    body: raw,
  });

  const data = (await response.json()) as {
    data: { xp: number };
    isLevelUp: boolean;
    newlevelup?: {
      level: number;
    };
  };

  if (data.isLevelUp) {
    await message.reply({
      content: `You leveled up to level ${data.newlevelup?.level}!`,
    });
  }
}
