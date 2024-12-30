import { Observable } from '@nativescript/core';
import { Reward, UserRewards, RewardType } from '../models/rewards.model';
import { NotificationService } from './notification.service';
import { formatCurrency } from '../utils/currency';

export class RewardsService extends Observable {
  private static instance: RewardsService;
  private userRewards: Map<string, UserRewards> = new Map();
  private notificationService: NotificationService;

  private constructor() {
    super();
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): RewardsService {
    if (!RewardsService.instance) {
      RewardsService.instance = new RewardsService();
    }
    return RewardsService.instance;
  }

  private initUserRewards(userId: string): UserRewards {
    const rewards: UserRewards = {
      userId,
      totalPoints: 0,
      level: 1,
      currentLevelPoints: 0,
      nextLevelPoints: 100,
      rewards: []
    };
    this.userRewards.set(userId, rewards);
    return rewards;
  }

  async getUserRewards(userId: string): Promise<UserRewards> {
    return this.userRewards.get(userId) || this.initUserRewards(userId);
  }

  async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    const userRewards = await this.getUserRewards(userId);
    userRewards.totalPoints += points;
    userRewards.currentLevelPoints += points;

    // Verifica level up
    if (userRewards.currentLevelPoints >= userRewards.nextLevelPoints) {
      userRewards.level++;
      userRewards.currentLevelPoints -= userRewards.nextLevelPoints;
      userRewards.nextLevelPoints = Math.floor(userRewards.nextLevelPoints * 1.5);

      await this.notificationService.createNotification(
        userId,
        'SYSTEM',
        '🎉 Level Up!',
        `Parabéns! Você alcançou o nível ${userRewards.level}!`
      );
    }

    this.userRewards.set(userId, userRewards);
  }

  async createReward(
    userId: string,
    type: RewardType,
    title: string,
    description: string,
    points: number,
    data?: any
  ): Promise<Reward> {
    const reward: Reward = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      description,
      points,
      achieved: false,
      data
    };

    const userRewards = await this.getUserRewards(userId);
    userRewards.rewards.push(reward);
    this.userRewards.set(userId, userRewards);

    return reward;
  }

  async achieveReward(userId: string, rewardId: string): Promise<void> {
    const userRewards = await this.getUserRewards(userId);
    const reward = userRewards.rewards.find(r => r.id === rewardId);

    if (reward && !reward.achieved) {
      reward.achieved = true;
      reward.achievedAt = new Date();
      await this.awardPoints(userId, reward.points, reward.title);

      await this.notificationService.createNotification(
        userId,
        'SYSTEM',
        '🏆 Nova Conquista!',
        `${reward.title} - Ganhou ${reward.points} pontos!`
      );
    }
  }

  async checkGoalCompletion(userId: string, goalName: string, savedAmount: number): Promise<void> {
    await this.createReward(
      userId,
      'GOAL_COMPLETED',
      'Meta Alcançada!',
      `Você completou a meta: ${goalName}`,
      50,
      { goalName, savedAmount }
    );
  }

  async checkSavingsMilestone(userId: string, totalSaved: number): Promise<void> {
    const milestones = [1000, 5000, 10000, 50000];
    const nextMilestone = milestones.find(m => totalSaved >= m);

    if (nextMilestone) {
      await this.createReward(
        userId,
        'SAVINGS_MILESTONE',
        'Marco de Economia!',
        `Você economizou ${formatCurrency(nextMilestone)}`,
        100,
        { milestone: nextMilestone }
      );
    }
  }

  async checkStreak(userId: string, days: number): Promise<void> {
    const streakMilestones = [7, 30, 90, 180, 365];
    const nextStreak = streakMilestones.find(s => days >= s);

    if (nextStreak) {
      await this.createReward(
        userId,
        'STREAK',
        'Sequência Incrível!',
        `${nextStreak} dias consecutivos economizando`,
        75,
        { streakDays: nextStreak }
      );
    }
  }
}