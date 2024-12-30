import { Observable } from '@nativescript/core';
import { SavingsGoal, GoalProgress } from '../models/goals.model';

export class GoalsService extends Observable {
  private static instance: GoalsService;
  private goals: SavingsGoal[] = [];

  private constructor() {
    super();
  }

  static getInstance(): GoalsService {
    if (!GoalsService.instance) {
      GoalsService.instance = new GoalsService();
    }
    return GoalsService.instance;
  }

  async createGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Promise<SavingsGoal> {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false
    };

    this.goals.push(newGoal);
    return newGoal;
  }

  async getUserGoals(userId: string): Promise<SavingsGoal[]> {
    return this.goals.filter(g => g.userId === userId);
  }

  async updateGoalProgress(goalId: string, amount: number): Promise<void> {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return;

    goal.currentAmount += amount;
    goal.updatedAt = new Date();
    
    if (goal.currentAmount >= goal.targetAmount) {
      goal.completed = true;
    }
  }

  getGoalProgress(goal: SavingsGoal): GoalProgress {
    const progress: GoalProgress = {
      percentage: (goal.currentAmount / goal.targetAmount) * 100,
      remainingAmount: goal.targetAmount - goal.currentAmount
    };

    if (goal.deadline) {
      const today = new Date();
      const daysRemaining = Math.ceil((goal.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      progress.daysRemaining = daysRemaining;

      if (daysRemaining > 0 && goal.currentAmount > 0) {
        const dailyRate = goal.currentAmount / (goal.createdAt.getTime() - today.getTime());
        const estimatedDays = progress.remainingAmount / dailyRate;
        progress.estimatedCompletion = new Date(today.getTime() + (estimatedDays * 24 * 60 * 60 * 1000));
      }
    }

    return progress;
  }
}