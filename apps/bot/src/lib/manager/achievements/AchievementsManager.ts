interface IAchievement {
  id: string;
  name: string;
  description: string;
  image: string;
  requirements: string[];
  rewards: string[];
}

export class AchievementsManager {
  public static async create(data: {
    guildId: string;
    name: string;
    description: string;
    image: string;
    requirements: string[];
    rewards: string[];
  }) {}
}
