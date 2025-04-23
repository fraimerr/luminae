import { GuildMember } from "discord.js";

export default async function (member: GuildMember) {
  if (member.user.bot) return;

  const guild = member.guild;
  const invites = await guild.invites.fetch();
  const invite = invites.find((i) => i.inviter?.id === member.id);

  
}