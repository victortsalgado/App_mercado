import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export async function notifyDeal(
  store: string,
  product: string,
  price: number,
  savings: number
): Promise<void> {
  const user = AuthService.getInstance().currentUser;
  if (!user) return;

  await NotificationService.getInstance().createNotification(
    user.id,
    'DEAL',
    'Nova Promoção!',
    `${product} por R$ ${price} em ${store}. Economia de R$ ${savings}!`,
    { store, product, price, savings }
  );
}

export async function notifySavings(
  amount: number,
  period: string
): Promise<void> {
  const user = AuthService.getInstance().currentUser;
  if (!user) return;

  await NotificationService.getInstance().createNotification(
    user.id,
    'SAVINGS',
    'Meta de Economia Atingida! 🎉',
    `Você economizou R$ ${amount} ${period}!`,
    { amount, period }
  );
}

export async function notifyPriceAlert(
  product: string,
  store: string,
  currentPrice: number,
  previousPrice: number
): Promise<void> {
  const user = AuthService.getInstance().currentUser;
  if (!user) return;

  await NotificationService.getInstance().createNotification(
    user.id,
    'ALERT',
    'Alerta de Preço',
    `${product} em ${store} aumentou de R$ ${previousPrice} para R$ ${currentPrice}`,
    { product, store, currentPrice, previousPrice }
  );
}