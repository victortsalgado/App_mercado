import { Observable } from '@nativescript/core';
import { Receipt } from '../../models/receipt.model';
import { SocialService } from '../../services/social.service';
import { Frame } from '@nativescript/core';

export class ReceiptDetailsViewModel extends Observable {
  private _receipt: Receipt;
  private socialService: SocialService;
  private _listViewHeight: number;

  constructor(receipt: Receipt) {
    super();
    this._receipt = receipt;
    this.socialService = SocialService.getInstance();
    this._listViewHeight = Math.min(this._receipt.items.length * 50, 300);
  }

  get receipt(): Receipt {
    return this._receipt;
  }

  get listViewHeight(): number {
    return this._listViewHeight;
  }

  async shareReceipt() {
    Frame.topmost().navigate({
      moduleName: 'components/social/share-post',
      context: {
        type: 'REVIEW',
        store: this._receipt.store,
        initialContent: `Compras em ${this._receipt.store}\nTotal: R$ ${this._receipt.total}`
      }
    });
  }

  async sharePromotion() {
    // Encontra o item mais barato para sugerir como promoção
    const cheapestItem = this._receipt.items
      .sort((a, b) => a.price - b.price)[0];

    Frame.topmost().navigate({
      moduleName: 'components/social/share-post',
      context: {
        type: 'DEAL',
        store: this._receipt.store,
        productName: cheapestItem.name,
        price: cheapestItem.price,
        initialContent: `Promoção em ${this._receipt.store}!\n${cheapestItem.name} por apenas R$ ${cheapestItem.price}`
      }
    });
  }
}