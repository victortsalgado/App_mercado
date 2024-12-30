export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences?: {
    favoriteStores: string[];
    preferredCategories: string[];
    maxBudget?: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
}