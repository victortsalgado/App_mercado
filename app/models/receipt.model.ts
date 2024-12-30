export interface Receipt {
  id: string;
  store: string;
  date: Date;
  total: number;
  items: ReceiptItem[];
  imageUrl: string;
  userId: string;
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}