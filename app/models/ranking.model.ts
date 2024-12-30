export interface RankingUser {
  userId: string;
  name: string;
  points: number;
  level: number;
  position: number;
  achievements: number;
  savingsAmount: number;
}

export interface Leaderboard {
  period: 'weekly' | 'monthly' | 'allTime';
  category: 'points' | 'savings' | 'achievements';
  users: RankingUser[];
  lastUpdated: Date;
}

export interface UserRanking {
  position: number;
  previousPosition: number;
  category: string;
  value: number;
  total: number;
}