import "dotenv/config";

import { readdirSync } from "node:fs";
import { Client, Collection, GatewayIntentBits, Options, Partials } from "discord.js";
import { Agent } from "undici";
import { config } from "./config";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { env } from "./env";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.Channel],
  failIfNotExists: false,
  sweepers: {
    messages: {
      interval: 60,
      filter:
        () =>
        (msg: {
          editedTimestamp: any;
          createdTimestamp: any;
          author: { bot: any };
          member: any;
        }) =>
          Date.now() - (msg.editedTimestamp ?? msg.createdTimestamp) > 30 * 60 * 1_000 ||
          msg.author?.bot ||
          !msg.member,
    },
    threads: {
      interval: 60,
      filter: () => (thread: { archived: any }) => thread.archived!,
    },
  },
  makeCache: Options.cacheWithLimits({
    MessageManager: 100,
  }),

  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
});

client.cluster = new ClusterClient(client);

const agent = new Agent({
  connect: {
    timeout: 30_000,
  },
});

client.rest.setAgent(agent);

const handlers = [];
const files = readdirSync("src/handlers/").filter((file) => file.endsWith(".ts"));
for (const dir of files) {
  const { handler } = require(`./handlers/${dir}`) as {
    handler: (client: Client) => void;
  };
  handlers.push(handler);
}

for (const handler of [config, ...handlers]) handler(client);

void client.login(env.BOT_TOKEN);
