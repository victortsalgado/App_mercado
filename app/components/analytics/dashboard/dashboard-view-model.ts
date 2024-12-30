import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { AnalyticsService } from '../../../services/analytics.service';
import { AuthService } from '../../../services/auth.service';
import { formatCurrency } from '../../../utils/currency';
import { Period, PeriodStats } from '../../../models/analytics.model';

export class DashboardViewModel extends Observable {
  private analyticsService: AnalyticsService;
  private authService: AuthService;
  private _selectedPeriod: Period = 'month';
  private _periodStats: PeriodStats = {
    totalSpent: 0,
    totalSaved: 0,
    receiptCount: 0
  };
  private _spendingData: any[] = [];
  private _topCategories: any[] = [];
  private _frequentStores: any[] = [];

  constructor() {
    super();
    this.analyticsService = AnalyticsService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadDashboard();
  }

  private async loadDashboard() {
    const user = this.authService.currentUser;
    if (!user) return;

    const insights = await this.analyticsService.getUserInsights(user.id);
    if (!insights) return;

    this.updatePeriodStats(insights);
    this.updateSpendingData(insights);
    this.updateTopCategories(insights);
    this.updateFrequentStores(insights);
  }

  private updatePeriodStats(insights: any) {
    this._periodStats = {
      totalSpent: insights.averageSpending,
      totalSaved: insights.averageSpending * 0.15, // Exemplo
      receiptCount: 10 // Exemplo
    };
    this.notifyPropertyChange('periodStats', this._periodStats);
  }

  private updateSpendingData(insights: any) {
    // Implementar lógica de dados do gráfico
    this.notifyPropertyChange('spendingData', this._spendingData);
  }

  private updateTopCategories(insights: any) {
    this._topCategories = insights.preferredCategories
      .map((category: string) => ({
        name: category,
        spending: Math.random() * 1000 // Exemplo
      }))
      .slice(0, 5);
    this.notifyPropertyChange('topCategories', this._topCategories);
  }

  private updateFrequentStores(insights: any) {
    this._frequentStores = Array.from(insights.frequentStores.entries())
      .map(([store, visits]: [string, number]) => ({
        name: store,
        visits,
        spending: Math.random() * 1000 // Exemplo
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
    this.notifyPropertyChange('frequentStores', this._frequentStores);
  }

  get selectedPeriod(): Period {
    return this._selectedPeriod;
  }

  get periodStats(): PeriodStats {
    return this._periodStats;
  }

  get spendingData(): any[] {
    return this._spendingData;
  }

  get topCategories(): any[] {
    return this._topCategories;
  }

  get frequentStores(): any[] {
    return this._frequentStores;
  }

  showFilters() {
    Frame.topmost().navigate({
      moduleName: 'components/analytics/filters/filters-modal'
    });
  }
}