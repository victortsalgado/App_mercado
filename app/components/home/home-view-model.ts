import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { ReceiptStorageService } from '../../services/receipt-storage.service';
import { Receipt } from '../../models/receipt.model';

export class HomeViewModel extends Observable {
  private _receipts: Receipt[] = [];
  private _promotions: any[] = [];
  private _totalSavings: number = 0;
  private storageService: ReceiptStorageService;

  constructor() {
    super();
    this.storageService = ReceiptStorageService.getInstance();
    this.loadReceipts();
    
    // Dados de exemplo para promoções
    this._promotions = [
      { 
        store: 'Supermercado Exemplo',
        description: 'Promoção em produtos de limpeza!',
        savings: 25.50
      }
    ];
    
    this.calculateTotalSavings();
  }

  async loadReceipts() {
    this._receipts = await this.storageService.getReceipts();
    this.notifyPropertyChange('receipts', this._receipts);
  }

  get receipts(): Receipt[] {
    return this._receipts;
  }

  get promotions(): any[] {
    return this._promotions;
  }

  get totalSavings(): string {
    return `R$ ${this._totalSavings.toFixed(2)}`;
  }

  onScanReceipt() {
    Frame.topmost().navigate({
      moduleName: 'components/camera/camera-view'
    });
  }

  private calculateTotalSavings() {
    this._totalSavings = this._promotions.reduce((acc, curr) => acc + curr.savings, 0);
    this.notifyPropertyChange('totalSavings', this._totalSavings);
  }
}