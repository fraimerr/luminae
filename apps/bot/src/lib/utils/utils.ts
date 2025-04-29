import { Buffer } from "node:buffer";

import {
  ActionRowBuilder,
  BaseInteraction,
  ChatInputCommandInteraction,
  resolveColor,
  Message,
  type ActionRow,
  type Client,
  type ColorResolvable,
  type Guild,
  type GuildBasedChannel,
  type GuildMember,
  type MessageActionRowComponent,
  type MessageActionRowComponentBuilder,
  type Role,
  type User,
  InteractionReplyOptions,
  MessageReplyOptions,
  InteractionEditReplyOptions,
  MessageFlags,
} from "discord.js";
import { request } from "undici";

export const getUser = async ({ client }: { client: Client }, arg?: string): Promise<User> => {
  if (!arg) throw new Error("No user provided");
  return client.users.fetch(arg.replaceAll(/\D/g, ""));
};

export const getMember = ({ guild }: { guild: Guild | null }, arg?: string): GuildMember | undefined => {
  if (!arg || !guild) return;
  return guild.members.cache.find(
    (member) =>
      (member.user.id === arg.replaceAll(/\D/g, "") ||
        member.user.tag === arg ||
        member.user.username === arg ||
        member.user.username.toLowerCase() === arg.toLowerCase() ||
        member.nickname === arg ||
        member.user.username.startsWith(arg) ||
        member.nickname?.startsWith(arg)) ??
      false,
  );
};

export const getRole = ({ guild }: { guild: Guild | null }, arg?: string | null): Role | undefined => {
  if (!arg || !guild) return;
  return guild.roles.cache.find(
    (role) =>
      role.id === arg.replaceAll(/\D/g, "") || role.name === arg || role.name.toLowerCase() === arg.toLowerCase(),
  );
};

export const getChannel = <T extends GuildBasedChannel["type"]>(
  { guild }: { guild: Guild | null },
  arg?: string | null,
  types?: T[],
): (T extends GuildBasedChannel["type"] ? Extract<GuildBasedChannel, { type: T }> : GuildBasedChannel) | undefined => {
  if (!arg || !guild) return;
  const foundChannel = guild.channels.cache
    .filter((channel) => (types ? types.includes(channel.type as T) : true))
    .find(
      (channel) =>
        channel.id === arg.replaceAll(/\D/g, "") ||
        channel.name === arg ||
        channel.name.toLowerCase() === arg.toLowerCase() ||
        channel.name.startsWith(arg) ||
        channel.name.toLowerCase().startsWith(arg.toLowerCase()),
    );
  if (!foundChannel) return;
  return foundChannel as T extends GuildBasedChannel["type"]
    ? Extract<GuildBasedChannel, { type: T }>
    : GuildBasedChannel;
};

export const getMentionable = ({ guild }: { guild: Guild | null }, arg?: string): GuildMember | Role | undefined => {
  return getRole({ guild }, arg) ?? getMember({ guild }, arg);
};

export const trim = <T extends string | null | undefined>(str: T, max: number): T => {
  if (!str) return str;
  const trimmedStr = str.length > max ? `${str.slice(0, max - 3)}...` : str;
  return trimmedStr as T;
};

export const toTitleCase = (str: string): string => {
  return str
    .replaceAll("_", " ")
    .toLowerCase()
    .replaceAll(/\b\w/g, (l: string) => l.toUpperCase());
};

export const pascalToTitleCase = (str: string): string => {
  return str
    .replaceAll(/([\dA-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const validateColor = (embedColor: unknown): number | false => {
  try {
    return resolveColor(toTitleCase(embedColor as string).replace(/ +/, "") as ColorResolvable);
  } catch {
    return false;
  }
};

export const authorOrUser = (ctx: BaseInteraction | Message) => {
  return "user" in ctx ? ctx.user : ctx.author;
};

export const isInteraction = (
  ctx: BaseInteraction | Message,
): ctx is BaseInteraction => {
  return ctx instanceof BaseInteraction;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1_024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const ordinalFormat = (number: number | `${number}`) => {
  if (typeof number === "number") number = `${number}`;
  if (number.endsWith("1")) {
    return `${number}st`;
  } else if (number.endsWith("2")) {
    return `${number}nd`;
  } else if (number.endsWith("3")) {
    return `${number}rd`;
  }

  return `${number}th`;
};

export const escapeRegex = (str: string) => {
  return str.replaceAll(/[$()*+.?[\\\]^{|}]/g, "\\$&").replaceAll("-", "\\x2d");
};

export const isGif = (buffer: Buffer) => {
  if (buffer.length < 3) {
    return false;
  }

  return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
};

export const NoError = () => {};

export const tryCatch = <A extends unknown[], T extends (...args: A) => unknown>(callback: T, ...args: A) => {
  try {
    // eslint-disable-next-line n/no-callback-literal
    return {
      error: null,
      result: callback(...args) as T extends (...args: A) => infer R ? R : never,
    };
  } catch (error_) {
    const error = error_ as Error;
    return { error, result: null };
  }
};

export const splitMessage = (
  text: string,
  {
    maxLength = 2_000,
    char = "\n",
    prepend = "",
    append = "",
  }: {
    append?: string;
    char?: string[] | string;
    maxLength?: number;
    prepend?: string;
  } = {},
) => {
  if (text.length <= maxLength) return [text];
  let splitText = [text];
  if (Array.isArray(char)) {
    while (char.length > 0 && splitText.some((elem) => elem.length > maxLength)) {
      const currentChar = char.shift();
      splitText = splitText.flatMap((chunk) => chunk.split(currentChar!));
    }
  } else {
    splitText = text.split(char);
  }

  if (splitText.some((elem) => elem.length > maxLength)) throw new RangeError("SPLIT_MAX_LEN");
  const messages = [];
  let msg = "";
  for (const chunk of splitText) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    if (msg && (msg + char + chunk + append).length > maxLength) {
      messages.push(msg + append);
      msg = prepend;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    msg += (msg && msg !== prepend ? char : "") + chunk;
  }

  return messages.concat(msg).filter(Boolean);
};

export const appendZero = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`;
};

export const formatMs = (time: number, digits = 2) => {
  if (time >= 1_000) return `${(time / 1_000).toFixed(digits)}s`;
  if (time >= 1) return `${time.toFixed(digits)}ms`;
  return `${(time * 1_000).toFixed(digits)}μs`;
};

export const makeComponents = (components: ActionRow<MessageActionRowComponent>[]) =>
  components.map((c): ActionRowBuilder<MessageActionRowComponentBuilder> => ActionRowBuilder.from(c));

export const getComponent = <T extends MessageActionRowComponentBuilder = MessageActionRowComponentBuilder>(
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[],
  customId: string,
) =>
  components
    .flatMap((row) => row.components)
    .find((component) => "custom_id" in component.data && component.data.custom_id === customId) as T | undefined;

export const collectorFilter = (incoming: BaseInteraction | Message, original: BaseInteraction | Message) =>
  authorOrUser(incoming).id === authorOrUser(original).id;

export const resolveImageURL = async (url: string) => {
  try {
    const res = await request(url).catch(() => null);

    if (typeof res?.headers["content-type"] === "string" && res.headers["content-type"].startsWith("image/")) {
      const buffer = Buffer.from(await res.body.arrayBuffer());
      if (Buffer.byteLength(buffer) > 8 * 1_000_000) {
        return undefined;
      }

      return buffer;
    }

    return undefined;
  } catch {
    return undefined;
  }
};

export const handleReply = (
  ctx: ChatInputCommandInteraction<"cached"> | Message,
  options: Omit<InteractionReplyOptions & MessageReplyOptions & InteractionEditReplyOptions, "flags">,
  ephemeral?: boolean,
) => {
  if (ctx instanceof Message) {
    return ctx.reply(options);
  } else {
    if (ctx.replied || ctx.deferred) {
      return ctx.editReply(options);
    }

    return ctx.reply(ephemeral ? { ...options, flags: MessageFlags.Ephemeral } : options);
  }
};
