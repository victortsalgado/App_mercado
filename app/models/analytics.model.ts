export type Period = 'week' | 'month' | 'year';

export interface PeriodStats {
  totalSpent: number;
  totalSaved: number;
  receiptCount: number;
}

export interface CategorySpending {
  name: string;
  spending: number;
  percentage: number;
}

export interface StoreAnalytics {
  name: string;
  visits: number;
  spending: number;
  averageTicket: number;
}