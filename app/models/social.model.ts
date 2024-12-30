export interface Post {
  id: string;
  userId: string;
  type: 'DEAL' | 'PRICE_ALERT' | 'REVIEW';
  store: string;
  content: string;
  savings?: number;
  price?: number;
  productName?: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}