import { setTimeout } from "node:timers";

import { Time } from "@imranbarbhuiya/duration";
import {
  Collection,
  type ChatInputCommandInteraction,
  type ContextMenuCommandInteraction,
  type Message,
} from "discord.js";

import { authorOrUser } from "~/util/utils";

export const cooldown = (
  context: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
  command: { cooldown?: number; name: string },
  cooldown = context.client.cooldown,
  message: string | null | undefined = "Please wait {retryAfter} before using the command {name} again.",
): boolean => {
  if (!command.cooldown) return true;
  if (!cooldown.has(command.name)) {
    cooldown.set(command.name, new Collection());
  }

  const currentTime = Date.now();
  const timeStamps = cooldown.get(command.name)!;
  const cooldownAmount = command.cooldown * Time.Second;

  if (timeStamps.has(authorOrUser(context).id)) {
    const expireTime = timeStamps.get(authorOrUser(context).id)! + cooldownAmount;
    if (currentTime < expireTime) {
      const timeLeft = (expireTime - currentTime) / Time.Second;
      const retryAfter = timeLeft <= 60 ? `${timeLeft.toFixed(1)}s` : `${(timeLeft / 60).toFixed(1)}m`;
      const msg = message?.replace("{retryAfter}", retryAfter).replace("{name}", command.name);
      if (msg?.length) context.reply({ content: msg, ephemeral: true }).catch(() => null);
      return false;
    }

    return true;
  }

  timeStamps.set(authorOrUser(context).id, currentTime);
  setTimeout(() => timeStamps.delete(authorOrUser(context).id), cooldownAmount);
  return true;
};
