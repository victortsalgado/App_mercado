import { Observable } from '@nativescript/core';
import { Challenge, UserChallenge } from '../../models/challenge.model';
import { ChallengeGeneratorService } from './challenge-generator.service';
import { RewardsService } from '../rewards.service';
import { NotificationService } from '../notification.service';

export class ChallengeService extends Observable {
  private static instance: ChallengeService;
  private generator: ChallengeGeneratorService;
  private rewardsService: RewardsService;
  private notificationService: NotificationService;
  private userChallenges: Map<string, UserChallenge[]> = new Map();

  private constructor() {
    super();
    this.generator = ChallengeGeneratorService.getInstance();
    this.rewardsService = RewardsService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): ChallengeService {
    if (!ChallengeService.instance) {
      ChallengeService.instance = new ChallengeService();
    }
    return ChallengeService.instance;
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    let challenges = this.userChallenges.get(userId);
    
    if (!challenges || this.shouldRefreshChallenges(challenges)) {
      challenges = this.generator.generateDailyChallenges()
        .map(challenge => ({
          ...challenge,
          userId,
          startedAt: new Date()
        }));
      this.userChallenges.set(userId, challenges);
    }

    return challenges;
  }

  async updateProgress(userId: string, category: Challenge['category'], amount: number): Promise<void> {
    const challenges = await this.getUserChallenges(userId);
    const activeChallenges = challenges.filter(c => 
      !c.completed && c.category === category && c.expiresAt > new Date()
    );

    for (const challenge of activeChallenges) {
      challenge.progress += amount;
      
      if (challenge.progress >= challenge.target && !challenge.completed) {
        await this.completeChallenge(challenge);
      }
    }

    this.userChallenges.set(userId, challenges);
  }

  private async completeChallenge(challenge: UserChallenge): Promise<void> {
    challenge.completed = true;
    challenge.completedAt = new Date();

    await this.rewardsService.awardPoints(
      challenge.userId,
      challenge.points,
      `Desafio completado: ${challenge.title}`
    );

    await this.notificationService.createNotification(
      challenge.userId,
      'SYSTEM',
      '🎯 Desafio Completado!',
      `Você completou "${challenge.title}" e ganhou ${challenge.points} pontos!`
    );
  }

  private shouldRefreshChallenges(challenges: UserChallenge[]): boolean {
    return challenges.every(c => c.completed || c.expiresAt < new Date());
  }
}