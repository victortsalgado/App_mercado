import { Observable } from '@nativescript/core';
import { League, UserLeague } from '../../models/league.model';
import { LeagueConfigService } from './league-config.service';
import { NotificationService } from '../notification.service';
import { RewardsService } from '../rewards.service';

export class LeagueService extends Observable {
  private static instance: LeagueService;
  private configService: LeagueConfigService;
  private notificationService: NotificationService;
  private rewardsService: RewardsService;
  private userLeagues: Map<string, UserLeague> = new Map();

  private constructor() {
    super();
    this.configService = LeagueConfigService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.rewardsService = RewardsService.getInstance();
  }

  static getInstance(): LeagueService {
    if (!LeagueService.instance) {
      LeagueService.instance = new LeagueService();
    }
    return LeagueService.instance;
  }

  async getUserLeague(userId: string): Promise<UserLeague> {
    let userLeague = this.userLeagues.get(userId);
    
    if (!userLeague) {
      userLeague = {
        userId,
        leagueId: 'bronze',
        currentPoints: 0,
        weeklyPoints: 0,
        monthlyPoints: 0,
        joinedAt: new Date()
      };
      this.userLeagues.set(userId, userLeague);
    }

    return userLeague;
  }

  async addPoints(userId: string, points: number): Promise<void> {
    const userLeague = await this.getUserLeague(userId);
    const oldLeague = this.configService.getLeagueByPoints(userLeague.currentPoints);

    userLeague.currentPoints += points;
    userLeague.weeklyPoints += points;
    userLeague.monthlyPoints += points;

    const newLeague = this.configService.getLeagueByPoints(userLeague.currentPoints);
    
    if (newLeague.id !== oldLeague.id) {
      await this.handlePromotion(userId, oldLeague, newLeague);
    }

    this.userLeagues.set(userId, userLeague);
  }

  private async handlePromotion(
    userId: string, 
    oldLeague: League, 
    newLeague: League
  ): Promise<void> {
    const userLeague = await this.getUserLeague(userId);
    userLeague.leagueId = newLeague.id;
    userLeague.lastPromotedAt = new Date();

    await this.notificationService.createNotification(
      userId,
      'SYSTEM',
      '🏆 Promoção de Liga!',
      `Parabéns! Você subiu para ${newLeague.name}!`
    );

    // Recompensa de promoção
    await this.rewardsService.awardPoints(
      userId,
      500,
      `Promoção para ${newLeague.name}`
    );
  }

  async distributeWeeklyRewards(): Promise<void> {
    for (const [userId, userLeague] of this.userLeagues) {
      const league = this.configService.getLeagueByPoints(userLeague.currentPoints);
      
      await this.rewardsService.awardPoints(
        userId,
        league.rewards.weekly,
        `Recompensa semanal da ${league.name}`
      );

      userLeague.weeklyPoints = 0;
    }
  }

  async distributeMonthlyRewards(): Promise<void> {
    for (const [userId, userLeague] of this.userLeagues) {
      const league = this.configService.getLeagueByPoints(userLeague.currentPoints);
      
      await this.rewardsService.awardPoints(
        userId,
        league.rewards.monthly,
        `Recompensa mensal da ${league.name}`
      );

      userLeague.monthlyPoints = 0;
    }
  }
}