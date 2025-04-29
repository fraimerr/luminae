import { ButtonInteraction, Client, GuildMember } from "discord.js";

export interface ExtendedButton extends ButtonInteraction {
  member: GuildMember;
  client: Client;
}
