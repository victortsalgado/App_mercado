import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { ReceiptStorageService } from '../../services/receipt-storage.service';
import { AnalyticsService } from '../../services/analytics.service';
import { User } from '../../models/user.model';
import { Receipt } from '../../models/receipt.model';

export class ProfileViewModel extends Observable {
  private authService: AuthService;
  private receiptService: ReceiptStorageService;
  private analyticsService: AnalyticsService;
  private _user: User | null = null;
  private _receipts: Receipt[] = [];
  private _stats = {
    totalReceipts: 0,
    totalSavings: 0,
    favoriteStore: ''
  };

  constructor() {
    super();
    this.authService = AuthService.getInstance();
    this.receiptService = ReceiptStorageService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
    this.loadData();
  }

  private async loadData() {
    this._user = this.authService.currentUser;
    if (this._user) {
      await Promise.all([
        this.loadReceipts(),
        this.loadStats()
      ]);
    }
  }

  private async loadReceipts() {
    this._receipts = await this.receiptService.getReceipts();
    this.notifyPropertyChange('receipts', this._receipts);
  }

  private async loadStats() {
    if (!this._user) return;
    
    const insights = await this.analyticsService.getUserInsights(this._user.id);
    if (insights) {
      this._stats = {
        totalReceipts: this._receipts.length,
        totalSavings: insights.averageSpending,
        favoriteStore: Array.from(insights.frequentStores.entries())
          .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
      };
      this.notifyPropertyChange('stats', this._stats);
    }
  }

  get user(): User | null {
    return this._user;
  }

  get receipts(): Receipt[] {
    return this._receipts;
  }

  get stats() {
    return this._stats;
  }

  editProfile() {
    Frame.topmost().navigate({
      moduleName: 'components/profile/edit-profile'
    });
  }
}