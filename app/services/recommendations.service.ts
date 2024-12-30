import { AnalyticsService } from './analytics.service';
import { Receipt } from '../models/receipt.model';
import { User } from '../models/user.model';

interface Recommendation {
  type: 'PRODUCT' | 'STORE' | 'SAVINGS';
  title: string;
  description: string;
  score: number;
  savings?: number;
}

export class RecommendationsService {
  private static instance: RecommendationsService;
  private analyticsService: AnalyticsService;

  private constructor() {
    this.analyticsService = AnalyticsService.getInstance();
  }

  static getInstance(): RecommendationsService {
    if (!RecommendationsService.instance) {
      RecommendationsService.instance = new RecommendationsService();
    }
    return RecommendationsService.instance;
  }

  async getPersonalizedRecommendations(user: User): Promise<Recommendation[]> {
    const userPattern = await this.analyticsService.getUserInsights(user.id);
    if (!userPattern) return [];

    const recommendations: Recommendation[] = [];

    // Recomendações baseadas em padrões de compra
    const frequentProducts = Array.from(userPattern.frequentProducts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    for (const [product, frequency] of frequentProducts) {
      recommendations.push({
        type: 'PRODUCT',
        title: `${product} em promoção!`,
        description: 'Encontramos um preço mais baixo para este produto que você compra frequentemente',
        score: frequency / 10,
        savings: Math.random() * 10 // Mock de economia
      });
    }

    // Recomendações baseadas em gastos
    if (userPattern.averageSpending > 0) {
      recommendations.push({
        type: 'SAVINGS',
        title: 'Oportunidade de economia',
        description: `Você pode economizar comprando alguns itens em diferentes mercados`,
        score: 0.8,
        savings: userPattern.averageSpending * 0.15
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  async getStoreRecommendations(storeId: string): Promise<Recommendation[]> {
    const storeAnalytics = await this.analyticsService.getStoreInsights(storeId);
    if (!storeAnalytics) return [];

    const recommendations: Recommendation[] = [];

    // Recomendações baseadas em produtos populares
    storeAnalytics.popularProducts.forEach((product, index) => {
      if (index < 3) {
        recommendations.push({
          type: 'PRODUCT',
          title: `${product.name} em destaque`,
          description: `Este produto é muito popular em nossa loja`,
          score: 0.9 - (index * 0.1)
        });
      }
    });

    return recommendations;
  }
}