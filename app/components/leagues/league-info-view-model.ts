import { Observable } from '@nativescript/core';
import { League, LeagueTier } from '../../models/league.model';
import { LeagueService } from '../../services/leagues/league.service';
import { LeagueConfigService } from '../../services/leagues/league-config.service';
import { AuthService } from '../../services/auth.service';

export class LeagueInfoViewModel extends Observable {
  private leagueService: LeagueService;
  private configService: LeagueConfigService;
  private authService: AuthService;
  private _league: League;
  private _currentPoints: number = 0;
  private _weeklyPoints: number = 0;
  private _monthlyPoints: number = 0;
  private _nextLeague: League;

  constructor() {
    super();
    this.leagueService = LeagueService.getInstance();
    this.configService = LeagueConfigService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadLeagueInfo();
  }

  async loadLeagueInfo() {
    const user = this.authService.currentUser;
    if (!user) return;

    const userLeague = await this.leagueService.getUserLeague(user.id);
    this._league = this.configService.getLeagueByPoints(userLeague.currentPoints);
    this._currentPoints = userLeague.currentPoints;
    this._weeklyPoints = userLeague.weeklyPoints;
    this._monthlyPoints = userLeague.monthlyPoints;

    const leagues = this.configService.getLeagues();
    const currentIndex = leagues.findIndex(l => l.id === this._league.id);
    this._nextLeague = leagues[currentIndex + 1] || leagues[currentIndex];

    this.notifyPropertyChange('league', this._league);
    this.notifyPropertyChange('currentPoints', this._currentPoints);
    this.notifyPropertyChange('weeklyPoints', this._weeklyPoints);
    this.notifyPropertyChange('monthlyPoints', this._monthlyPoints);
    this.notifyPropertyChange('nextLeague', this._nextLeague);
  }

  get league(): League {
    return this._league;
  }

  get currentPoints(): number {
    return this._currentPoints;
  }

  get weeklyPoints(): number {
    return this._weeklyPoints;
  }

  get monthlyPoints(): number {
    return this._monthlyPoints;
  }

  get nextLeague(): League {
    return this._nextLeague;
  }

  get getPointsToNextLeague(): number {
    return this._nextLeague.minPoints - this._currentPoints;
  }

  getLeagueEmoji(tier: LeagueTier): string {
    switch (tier) {
      case 'BRONZE': return '🥉';
      case 'SILVER': return '🥈';
      case 'GOLD': return '🥇';
      case 'PLATINUM': return '💎';
      case 'DIAMOND': return '👑';
      default: return '🏆';
    }
  }
}