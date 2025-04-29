import type { Command } from "~/structure/Command";
import type { ClusterManager } from "discord-hybrid-sharding";
import type { CommonCommand, ContextMenuMessageCommand, ContextMenuUserCommand } from "./command";
import type { Collection, Snowflake } from "discord.js";

declare module "discord.js" {
  interface Client {
    chatInputCommands: Collection<string, Command>;
    contextmenuCommands: Collection<string, ContextMenuMessageCommand | ContextMenuUserCommand>;
    cooldown: Collection<string, Collection<Snowflake, number>>;
    helpCommands: Collection<string, CommonCommand & { description: string; id?: Snowflake }>;
    snipe: Collection<string, Message>;
    cluster: ClusterClient<Client<boolean>>;
  }
}
