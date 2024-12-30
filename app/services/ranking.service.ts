import { Observable } from '@nativescript/core';
import { RankingUser, Leaderboard, UserRanking } from '../models/ranking.model';
import { RewardsService } from './rewards.service';
import { NotificationService } from './notification.service';

export class RankingService extends Observable {
  private static instance: RankingService;
  private rewardsService: RewardsService;
  private notificationService: NotificationService;
  private leaderboards: Map<string, Leaderboard> = new Map();

  private constructor() {
    super();
    this.rewardsService = RewardsService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService();
    }
    return RankingService.instance;
  }

  private getLeaderboardKey(period: Leaderboard['period'], category: Leaderboard['category']): string {
    return \`\${period}-\${category}\`;
  }

  async getLeaderboard(
    period: Leaderboard['period'],
    category: Leaderboard['category']
  ): Promise<Leaderboard> {
    const key = this.getLeaderboardKey(period, category);
    return this.leaderboards.get(key) || {
      period,
      category,
      users: [],
      lastUpdated: new Date()
    };
  }

  async updateUserRanking(userId: string, data: Partial<RankingUser>): Promise<void> {
    for (const [key, leaderboard] of this.leaderboards) {
      const userIndex = leaderboard.users.findIndex(u => u.userId === userId);
      
      if (userIndex >= 0) {
        leaderboard.users[userIndex] = {
          ...leaderboard.users[userIndex],
          ...data
        };
      } else {
        leaderboard.users.push({
          userId,
          name: 'Usuário',
          points: 0,
          level: 1,
          position: leaderboard.users.length + 1,
          achievements: 0,
          savingsAmount: 0,
          ...data
        });
      }

      // Reordena baseado na categoria
      leaderboard.users.sort((a, b) => {
        switch (leaderboard.category) {
          case 'points':
            return b.points - a.points;
          case 'savings':
            return b.savingsAmount - a.savingsAmount;
          case 'achievements':
            return b.achievements - a.achievements;
        }
      });

      // Atualiza posições
      leaderboard.users.forEach((user, index) => {
        user.position = index + 1;
      });

      leaderboard.lastUpdated = new Date();
      this.leaderboards.set(key, leaderboard);
    }
  }

  async getUserRankings(userId: string): Promise<UserRanking[]> {
    const rankings: UserRanking[] = [];
    
    for (const [key, leaderboard] of this.leaderboards) {
      const user = leaderboard.users.find(u => u.userId === userId);
      if (user) {
        rankings.push({
          position: user.position,
          previousPosition: user.position, // TODO: Implementar histórico
          category: \`\${leaderboard.period}-\${leaderboard.category}\`,
          value: this.getRankingValue(user, leaderboard.category),
          total: leaderboard.users.length
        });
      }
    }

    return rankings;
  }

  private getRankingValue(user: RankingUser, category: Leaderboard['category']): number {
    switch (category) {
      case 'points':
        return user.points;
      case 'savings':
        return user.savingsAmount;
      case 'achievements':
        return user.achievements;
    }
  }

  async checkPositionChange(userId: string): Promise<void> {
    const rankings = await this.getUserRankings(userId);
    
    for (const ranking of rankings) {
      if (ranking.position < ranking.previousPosition) {
        await this.notificationService.createNotification(
          userId,
          'SYSTEM',
          '🏆 Subiu no Ranking!',
          \`Você subiu para a posição \${ranking.position} em \${ranking.category}!\`
        );
      }
    }
  }
}