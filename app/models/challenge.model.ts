export type ChallengeType = 'DAILY' | 'WEEKLY';
export type ChallengeCategory = 'SAVINGS' | 'SCANNING' | 'SOCIAL';

export interface Challenge {
  id: string;
  type: ChallengeType;
  category: ChallengeCategory;
  title: string;
  description: string;
  points: number;
  target: number;
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

export interface UserChallenge extends Challenge {
  userId: string;
  startedAt: Date;
  completedAt?: Date;
}