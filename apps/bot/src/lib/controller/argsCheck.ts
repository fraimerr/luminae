import type { Message } from "discord.js";

import { Constants } from "~/util/constants";

export const argsCheck = (message: Message, requiredArgs: string[], args: string[]): boolean => {
  if (requiredArgs.length > args.length) {
    const missingArgs = requiredArgs.slice(args.length);
    void message.reply(`Missing${Constants.emojis.colon}\`${missingArgs.join("`, `")}\``);
    return false;
  }

  return true;
};
