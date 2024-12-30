import { Receipt, ReceiptItem } from '../../models/receipt.model';

export class ReceiptParserService {
  private static instance: ReceiptParserService;

  private constructor() {}

  static getInstance(): ReceiptParserService {
    if (!ReceiptParserService.instance) {
      ReceiptParserService.instance = new ReceiptParserService();
    }
    return ReceiptParserService.instance;
  }

  async parseReceipt(text: string): Promise<Omit<Receipt, 'id' | 'imageUrl' | 'userId'>> {
    const lines = text.split('\n');
    
    return {
      store: this.extractStore(lines),
      date: this.extractDate(lines),
      total: this.extractTotal(lines),
      items: this.extractItems(lines)
    };
  }

  private extractStore(lines: string[]): string {
    const storePatterns = [
      /RAZAO SOCIAL:\s*(.+)/i,
      /NOME:\s*(.+)/i,
      /^([^0-9]{3,})/
    ];

    for (const line of lines) {
      for (const pattern of storePatterns) {
        const match = line.match(pattern);
        if (match?.[1]) {
          return match[1].trim();
        }
      }
    }

    return 'Loja não identificada';
  }

  private extractDate(lines: string[]): Date {
    const datePatterns = [
      /(\d{2}\/\d{2}\/\d{4})/,
      /DATA:\s*(\d{2}\/\d{2}\/\d{4})/i
    ];

    for (const line of lines) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match?.[1]) {
          return new Date(match[1]);
        }
      }
    }

    return new Date();
  }

  private extractTotal(lines: string[]): number {
    const totalPatterns = [
      /TOTAL\s*R?\$?\s*(\d+[.,]\d{2})/i,
      /VALOR TOTAL\s*R?\$?\s*(\d+[.,]\d{2})/i
    ];

    for (const line of lines) {
      for (const pattern of totalPatterns) {
        const match = line.match(pattern);
        if (match?.[1]) {
          return this.parsePrice(match[1]);
        }
      }
    }

    return 0;
  }

  private extractItems(lines: string[]): ReceiptItem[] {
    const items: ReceiptItem[] = [];
    let isItemSection = false;

    for (const line of lines) {
      const itemPattern = /(\d+)\s+(.+)\s+R?\$\s*(\d+[.,]\d{2})/;
      const match = line.match(itemPattern);
      
      if (match) {
        items.push({
          quantity: parseInt(match[1]),
          name: match[2].trim(),
          price: this.parsePrice(match[3])
        });
      }
    }

    return items;
  }

  private parsePrice(price: string): number {
    return parseFloat(price.replace(',', '.'));
  }
}