export interface IAchievement<T extends object = any> {
  /**
   * Achievement ID.
   */
  id: number;
  /**
   * Guild ID where the achievement was created.
   */
  guildID: string;
  /**
   * Name of the achievement.
   */
  name: string;
  /**
   * Description of the achievement.
   */
  description: string;
  /**
   * Reward for the achievement.
   */
  reward: number;
  /**
   * Achievement icon.
   */
  icon?: string;
  /**
   * Requirement for the achievement for getting it that would be tracked automatically.
   */
  trackingTarget?: IAchievementRequirement;
  /**
   * Achievement completions.
   */
  completions: ICompletion[];
  /**
   * Percent of guild members completed the achievement.
   */
  completionPercentage: number;
  /**
   * Date when the achievement was created.
   */
  createdAt: string;
  /**
   * Custom data for the achievement.
   */
  custom?: CustomAchievementData<T>;
}
export interface ICompletion {
  /**
   * Achievement ID.
   */
  achievementID: number;
  /**
   * Achievement icon.
   */
  icon?: string;

  guildID: string;
  userID: string;
  completedAt: string;
}
export interface IBaseProgression {
  achievementID: number;
  achievementName: string;
  achievementIcon?: string;
  progress: number;
}
export interface ICompletionEvent {
  guild: Guild;
  user: GuildMember;
  achievement: Achievement;
  channel: TextChannel;
}

export type IProgression<AdditionalInfoProvided extends boolean = false> = If<
  AdditionalInfoProvided,
  IBaseProgression & IAdditionalInfo,
  IBaseProgression
>;

export enum AchievementType {
  MESSAGES = 1,
  LEVELS = 2,
  XP = 3,
}

export interface IAchievementRequirement {
  type: AchievementType;
  target: number;
}

export interface IAdditionalInfo {
  guild: Guild;
  user: GuildMember;
  achievement: Achievement;
}
