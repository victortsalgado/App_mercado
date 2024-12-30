import { League, LeagueTier } from '../../models/league.model';

export class LeagueConfigService {
  private static instance: LeagueConfigService;
  private leagues: League[];

  private constructor() {
    this.leagues = this.initializeLeagues();
  }

  static getInstance(): LeagueConfigService {
    if (!LeagueConfigService.instance) {
      LeagueConfigService.instance = new LeagueConfigService();
    }
    return LeagueConfigService.instance;
  }

  getLeagues(): League[] {
    return this.leagues;
  }

  getLeagueByPoints(points: number): League {
    return this.leagues.find(
      league => points >= league.minPoints && points <= league.maxPoints
    ) || this.leagues[0];
  }

  private initializeLeagues(): League[] {
    return [
      {
        id: 'bronze',
        tier: 'BRONZE',
        name: 'Liga Bronze',
        minPoints: 0,
        maxPoints: 999,
        rewards: { weekly: 100, monthly: 500 }
      },
      {
        id: 'silver',
        tier: 'SILVER',
        name: 'Liga Prata',
        minPoints: 1000,
        maxPoints: 2499,
        rewards: { weekly: 200, monthly: 1000 }
      },
      {
        id: 'gold',
        tier: 'GOLD',
        name: 'Liga Ouro',
        minPoints: 2500,
        maxPoints: 4999,
        rewards: { weekly: 400, monthly: 2000 }
      },
      {
        id: 'platinum',
        tier: 'PLATINUM',
        name: 'Liga Platina',
        minPoints: 5000,
        maxPoints: 9999,
        rewards: { weekly: 800, monthly: 4000 }
      },
      {
        id: 'diamond',
        tier: 'DIAMOND',
        name: 'Liga Diamante',
        minPoints: 10000,
        maxPoints: Infinity,
        rewards: { weekly: 1500, monthly: 7500 }
      }
    ];
  }
}