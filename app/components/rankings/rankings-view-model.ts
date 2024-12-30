import { Observable } from '@nativescript/core';
import { RankingService } from '../../services/ranking.service';
import { AuthService } from '../../services/auth.service';
import { RankingUser, Leaderboard } from '../../models/ranking.model';
import { formatCurrency } from '../../utils/currency';

export class RankingsViewModel extends Observable {
  private rankingService: RankingService;
  private authService: AuthService;
  private _selectedPeriodIndex: number = 0;
  private _selectedCategoryIndex: number = 0;
  private _rankings: RankingUser[] = [];

  constructor() {
    super();
    this.rankingService = RankingService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadRankings();
  }

  get selectedPeriodIndex(): number {
    return this._selectedPeriodIndex;
  }

  set selectedPeriodIndex(value: number) {
    if (this._selectedPeriodIndex !== value) {
      this._selectedPeriodIndex = value;
      this.notifyPropertyChange('selectedPeriodIndex', value);
      this.loadRankings();
    }
  }

  get selectedCategoryIndex(): number {
    return this._selectedCategoryIndex;
  }

  set selectedCategoryIndex(value: number) {
    if (this._selectedCategoryIndex !== value) {
      this._selectedCategoryIndex = value;
      this.notifyPropertyChange('selectedCategoryIndex', value);
      this.loadRankings();
    }
  }

  get rankings(): RankingUser[] {
    return this._rankings;
  }

  private getPeriod(): Leaderboard['period'] {
    switch (this._selectedPeriodIndex) {
      case 0: return 'weekly';
      case 1: return 'monthly';
      case 2: return 'allTime';
      default: return 'weekly';
    }
  }

  private getCategory(): Leaderboard['category'] {
    switch (this._selectedCategoryIndex) {
      case 0: return 'points';
      case 1: return 'savings';
      case 2: return 'achievements';
      default: return 'points';
    }
  }

  async loadRankings() {
    const leaderboard = await this.rankingService.getLeaderboard(
      this.getPeriod(),
      this.getCategory()
    );
    
    this._rankings = leaderboard.users;
    this.notifyPropertyChange('rankings', this._rankings);
  }

  getValueLabel(category: string, value: number): string {
    switch (category) {
      case 'points':
        return \`\${value} pontos\`;
      case 'savings':
        return formatCurrency(value);
      case 'achievements':
        return \`\${value} conquistas\`;
      default:
        return value.toString();
    }
  }

  getPositionChange(current: number, previous: number): string {
    const diff = previous - current;
    if (diff > 0) return \`↑\${diff}\`;
    if (diff < 0) return \`↓\${Math.abs(diff)}\`;
    return '=';
  }

  getPositionChangeClass(current: number, previous: number): string {
    const diff = previous - current;
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  async refreshRankings() {
    await this.loadRankings();
  }
}