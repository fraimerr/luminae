import { lstatSync, readdirSync } from "node:fs";
import type { Client } from "discord.js";
import { type UserCommandType } from "~/structure/Command";

export const handler = (client: Client) => {
  const folders = readdirSync("src/commands/chatInputCommands/").filter((file) =>
    lstatSync(`src/commands/chatInputCommands/${file}`).isDirectory(),
  );
  for (const dir of folders) {
    const commandFiles = readdirSync(`src/commands/chatInputCommands/${dir}`).filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const { UserCommand } = require(`../commands/chatInputCommands/${dir}/${file}`) as {
        UserCommand: UserCommandType;
      };

      const command = new UserCommand();

      if (command.name) {
        command.category ??= dir;
        if (command.category === "owner") {
          command.ownerOnly = true;
        }

        client.chatInputCommands.set(command.name, command);
        if (command.subCommandsHelp) {
          for (const subCommand of command.subCommandsHelp) {
            subCommand.category ??= dir;
            subCommand.availability ??= command.availability;
            subCommand.cooldown ??= command.cooldown;
            subCommand.botPermissions ??= command.botPermissions;
            subCommand.userPermissions ??= command.userPermissions;
            subCommand.botChannelPermissions ??= command.botChannelPermissions;
            subCommand.userChannelPermissions ??= command.userChannelPermissions;
            client.helpCommands.set(subCommand.name, subCommand);
          }
        }
      }

      // delete require cache
      delete require.cache[require.resolve(`../commands/chatInputCommands/${dir}/${file}`)];
    }
  }
};
