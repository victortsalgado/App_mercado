export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category?: string;
  store?: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

export interface GoalProgress {
  percentage: number;
  remainingAmount: number;
  daysRemaining?: number;
  estimatedCompletion?: Date;
}