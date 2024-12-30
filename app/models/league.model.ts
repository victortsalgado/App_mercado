export type LeagueTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface League {
  id: string;
  tier: LeagueTier;
  name: string;
  minPoints: number;
  maxPoints: number;
  rewards: {
    weekly: number;
    monthly: number;
  };
}

export interface UserLeague {
  userId: string;
  leagueId: string;
  currentPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  joinedAt: Date;
  lastPromotedAt?: Date;
}