import { trim } from "./utils.js";

import type { EmbedBuilder } from "discord.js";

export const titleTrim = <T extends string | undefined>(title: T): T => trim(title, 256);

const authorNameTrim = <T extends string | undefined>(authorName: T): T => trim(authorName, 256);

export const descriptionTrim = <T extends string | undefined>(description: T): T => trim(description, 4_096);

const fieldNameTrim = (fieldName: string | null | undefined): string => trim(fieldName, 256)! || "\u200B";

export const filedValueTrim = (fieldValue: string | null | undefined): string => trim(fieldValue, 1_024)! || "\u200B";

const footerTextTrim = <T extends string | undefined>(footerText: T): T => trim(footerText, 2_048);

export const trimEmbed = (embed: EmbedBuilder): EmbedBuilder => {
  if (embed.data.title) {
    embed.setTitle(titleTrim(embed.data.title));
  }

  if (embed.data.description) {
    embed.setDescription(descriptionTrim(embed.data.description));
  }

  if (embed.data.footer?.text) {
    embed.data.footer.text = footerTextTrim(embed.data.footer.text);
  }

  if (embed.data.author?.name) {
    embed.data.author.name = authorNameTrim(embed.data.author.name);
  }

  // eslint-disable-next-line unicorn/no-array-for-each
  embed.data.fields?.forEach((field: { name: string; value: string }) => {
    field.name = fieldNameTrim(field.name);
    field.value = filedValueTrim(field.value);
  });
  embed.data.fields?.splice(25);
  return embed;
};
