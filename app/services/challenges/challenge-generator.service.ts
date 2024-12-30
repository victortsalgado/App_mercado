import { Challenge, ChallengeType, ChallengeCategory } from '../../models/challenge.model';

export class ChallengeGeneratorService {
  private static instance: ChallengeGeneratorService;

  private constructor() {}

  static getInstance(): ChallengeGeneratorService {
    if (!ChallengeGeneratorService.instance) {
      ChallengeGeneratorService.instance = new ChallengeGeneratorService();
    }
    return ChallengeGeneratorService.instance;
  }

  generateDailyChallenges(): Challenge[] {
    return [
      this.createSavingsChallenge(),
      this.createScanningChallenge(),
      this.createSocialChallenge()
    ];
  }

  private createSavingsChallenge(): Challenge {
    return {
      id: Date.now().toString(),
      type: 'DAILY',
      category: 'SAVINGS',
      title: 'Economizador do Dia',
      description: 'Economize R$ 50 em compras hoje',
      points: 100,
      target: 50,
      progress: 0,
      completed: false,
      expiresAt: this.getEndOfDay()
    };
  }

  private createScanningChallenge(): Challenge {
    return {
      id: Date.now().toString(),
      type: 'DAILY',
      category: 'SCANNING',
      title: 'Scanner Ativo',
      description: 'Escaneie 3 notas fiscais hoje',
      points: 75,
      target: 3,
      progress: 0,
      completed: false,
      expiresAt: this.getEndOfDay()
    };
  }

  private createSocialChallenge(): Challenge {
    return {
      id: Date.now().toString(),
      type: 'DAILY',
      category: 'SOCIAL',
      title: 'Compartilhador de Economia',
      description: 'Compartilhe 2 promoções com a comunidade',
      points: 50,
      target: 2,
      progress: 0,
      completed: false,
      expiresAt: this.getEndOfDay()
    };
  }

  private getEndOfDay(): Date {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }
}