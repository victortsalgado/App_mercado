interface ParsedReceipt {
  store: string;
  date: Date;
  total: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export class ReceiptParserService {
  static parseText(text: string): ParsedReceipt {
    // Implementação básica do parser
    const lines = text.split('\n');
    const receipt: ParsedReceipt = {
      store: this.extractStore(lines),
      date: this.extractDate(lines),
      total: this.extractTotal(lines),
      items: this.extractItems(lines)
    };

    return receipt;
  }

  private static extractStore(lines: string[]): string {
    // Normalmente o nome da loja está nas primeiras linhas
    return lines[0] || 'Loja não identificada';
  }

  private static extractDate(lines: string[]): Date {
    // Procura por padrões de data no texto
    const datePattern = /\d{2}\/\d{2}\/\d{4}/;
    for (const line of lines) {
      const match = line.match(datePattern);
      if (match) {
        return new Date(match[0]);
      }
    }
    return new Date();
  }

  private static extractTotal(lines: string[]): number {
    // Procura por padrões de valor total
    const totalPattern = /TOTAL[:\s]*R?\$?\s*(\d+[.,]\d{2})/i;
    for (const line of lines) {
      const match = line.match(totalPattern);
      if (match) {
        return parseFloat(match[1].replace(',', '.'));
      }
    }
    return 0;
  }

  private static extractItems(lines: string[]): Array<{name: string; price: number; quantity: number}> {
    const items = [];
    let isItemSection = false;

    for (const line of lines) {
      // Lógica simplificada para identificar itens
      const itemPattern = /(\d+)\s+(.+)\s+R?\$\s*(\d+[.,]\d{2})/;
      const match = line.match(itemPattern);
      
      if (match) {
        items.push({
          quantity: parseInt(match[1]),
          name: match[2].trim(),
          price: parseFloat(match[3].replace(',', '.'))
        });
      }
    }

    return items;
  }
}