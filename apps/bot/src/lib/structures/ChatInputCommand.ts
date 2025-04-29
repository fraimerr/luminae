import { Command } from "./Command.js";

import type { CommandOptions } from "~/types/command";
import type { Awaitable, ChatInputCommandInteraction, Client } from "discord.js";

export abstract class ChatInputCommand extends Command {
  public constructor(data: Command.Data, options?: Omit<CommandOptions, "aliases" | "args" | "availability">) {
    super(data, { ...options, availability: Command.Availability.Slash });
  }

  protected abstract override runTask(
    interaction: ChatInputCommandInteraction<"cached">,
    options: Command.ChatInputOptions,
    client: Client<true>,
  ): Awaitable<unknown>;
}
