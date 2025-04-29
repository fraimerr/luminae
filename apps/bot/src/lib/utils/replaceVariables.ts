import { Leveling } from "@prisma/client";
import { GuildMember } from "discord.js";

type Variables = Record<string, string>;

export const replaceVariables = (str: string, member: GuildMember, levelData: Leveling, mention: boolean) => {
  const variables: Variables = {
    "user.mention": mention ? `${member}` : member.user.tag,
    "user.nickname": member.displayName,
    "user.username": member.user.username,
    "user.id": member.id,
    level: levelData.level.toString(),
    xp: levelData.xp.toString(),
  };

  return str.replace(/{([a-z._]+)}/gi, (match, variable) => {
    return variables[variable] !== undefined ? variables[variable] : match;
  });
};
