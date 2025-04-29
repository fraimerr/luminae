import { Client } from "discord.js";
import { GiveawayManager } from "~/manager/GiveawayManager";

export default async function (client: Client) {
  void (await GiveawayManager.initGiveaways());
  void (await GiveawayManager.getOverdueGiveaways());
}
