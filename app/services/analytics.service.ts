import { Receipt } from '../models/receipt.model';
import { UserShoppingPattern, StoreAnalytics } from '../models/analytics.model';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private userPatterns: Map<string, UserShoppingPattern> = new Map();
  private storeAnalytics: Map<string, StoreAnalytics> = new Map();

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async processReceipt(receipt: Receipt): Promise<void> {
    await Promise.all([
      this.updateUserPattern(receipt),
      this.updateStoreAnalytics(receipt)
    ]);
  }

  private async updateUserPattern(receipt: Receipt): Promise<void> {
    let pattern = this.userPatterns.get(receipt.userId) || {
      userId: receipt.userId,
      frequentStores: new Map(),
      frequentProducts: new Map(),
      averageSpending: 0,
      preferredCategories: [],
      lastUpdate: new Date()
    };

    // Atualiza frequência da loja
    const storeVisits = pattern.frequentStores.get(receipt.store) || 0;
    pattern.frequentStores.set(receipt.store, storeVisits + 1);

    // Atualiza produtos frequentes
    receipt.items.forEach(item => {
      const productCount = pattern.frequentProducts.get(item.name) || 0;
      pattern.frequentProducts.set(item.name, productCount + item.quantity);
    });

    // Atualiza média de gastos
    pattern.averageSpending = (pattern.averageSpending + receipt.total) / 2;

    this.userPatterns.set(receipt.userId, pattern);
  }

  private async updateStoreAnalytics(receipt: Receipt): Promise<void> {
    let analytics = this.storeAnalytics.get(receipt.store) || {
      storeId: receipt.store,
      customerCount: 0,
      averageTicket: 0,
      popularProducts: [],
      peakHours: new Map()
    };

    analytics.customerCount++;
    analytics.averageTicket = (analytics.averageTicket + receipt.total) / 2;

    // Atualiza produtos populares
    receipt.items.forEach(item => {
      const existingProduct = analytics.popularProducts.find(p => p.name === item.name);
      if (existingProduct) {
        existingProduct.quantity += item.quantity;
      } else {
        analytics.popularProducts.push({
          name: item.name,
          quantity: item.quantity
        });
      }
    });

    // Ordena produtos por popularidade
    analytics.popularProducts.sort((a, b) => b.quantity - a.quantity);
    analytics.popularProducts = analytics.popularProducts.slice(0, 10); // Mantém top 10

    this.storeAnalytics.set(receipt.store, analytics);
  }

  async getUserInsights(userId: string): Promise<UserShoppingPattern | null> {
    return this.userPatterns.get(userId) || null;
  }

  async getStoreInsights(storeId: string): Promise<StoreAnalytics | null> {
    return this.storeAnalytics.get(storeId) || null;
  }
}