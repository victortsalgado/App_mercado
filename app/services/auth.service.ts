import { Observable } from '@nativescript/core';
import { User, AuthState } from '../models/user.model';

export class AuthService extends Observable {
  private static instance: AuthService;
  private _authState: AuthState = {
    user: null,
    token: null
  };

  private constructor() {
    super();
    this.loadStoredAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async loadStoredAuth() {
    // TODO: Implementar persistência local
  }

  async login(email: string, password: string): Promise<User> {
    // TODO: Implementar integração com backend
    const mockUser: User = {
      id: 'user123',
      email,
      name: 'Usuário Teste',
      createdAt: new Date(),
      preferences: {
        favoriteStores: [],
        preferredCategories: []
      }
    };

    this._authState.user = mockUser;
    this._authState.token = 'mock-token';
    this.notifyPropertyChange('authState', this._authState);

    return mockUser;
  }

  async logout(): Promise<void> {
    this._authState = {
      user: null,
      token: null
    };
    this.notifyPropertyChange('authState', this._authState);
  }

  get currentUser(): User | null {
    return this._authState.user;
  }

  get isAuthenticated(): boolean {
    return !!this._authState.user;
  }
}