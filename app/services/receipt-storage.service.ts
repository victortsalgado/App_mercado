import { Receipt } from '../models/receipt.model';

export class ReceiptStorageService {
  private static instance: ReceiptStorageService;
  private receipts: Receipt[] = [];

  private constructor() {}

  static getInstance(): ReceiptStorageService {
    if (!ReceiptStorageService.instance) {
      ReceiptStorageService.instance = new ReceiptStorageService();
    }
    return ReceiptStorageService.instance;
  }

  async saveReceipt(receipt: Receipt): Promise<void> {
    // TODO: Implementar persistência real dos dados
    this.receipts.push(receipt);
  }

  async getReceipts(): Promise<Receipt[]> {
    return this.receipts;
  }

  async getReceiptById(id: string): Promise<Receipt | undefined> {
    return this.receipts.find(r => r.id === id);
  }
}