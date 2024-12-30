export type RewardType = 'GOAL_COMPLETED' | 'SAVINGS_MILESTONE' | 'STREAK' | 'FIRST_RECEIPT';

export interface Reward {
  id: string;
  userId: string;
  type: RewardType;
  title: string;
  description: string;
  points: number;
  achieved: boolean;
  achievedAt?: Date;
  data?: any;
}

export interface UserRewards {
  userId: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  rewards: Reward[];
}