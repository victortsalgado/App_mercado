import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

export class EditProfileViewModel extends Observable {
  private authService: AuthService;
  private _name: string = '';
  private _email: string = '';
  private _favoriteStores: string[] = [];
  private _maxBudget: number = 0;

  constructor() {
    super();
    this.authService = AuthService.getInstance();
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.authService.currentUser;
    if (user) {
      this._name = user.name;
      this._email = user.email;
      this._favoriteStores = user.preferences?.favoriteStores || [];
      this._maxBudget = user.preferences?.maxBudget || 0;
      
      this.notifyPropertyChange('name', this._name);
      this.notifyPropertyChange('email', this._email);
      this.notifyPropertyChange('favoriteStores', this._favoriteStores);
      this.notifyPropertyChange('maxBudget', this._maxBudget);
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (this._name !== value) {
      this._name = value;
      this.notifyPropertyChange('name', value);
    }
  }

  get email(): string {
    return this._email;
  }

  get favoriteStores(): string[] {
    return this._favoriteStores;
  }

  get maxBudget(): number {
    return this._maxBudget;
  }

  set maxBudget(value: number) {
    if (this._maxBudget !== value) {
      this._maxBudget = value;
      this.notifyPropertyChange('maxBudget', value);
    }
  }

  removeStore(args: any) {
    const index = args.index;
    this._favoriteStores.splice(index, 1);
    this.notifyPropertyChange('favoriteStores', this._favoriteStores);
  }

  showAddStore() {
    // TODO: Implementar modal para adicionar nova loja
  }

  async saveProfile() {
    try {
      // TODO: Implementar atualização do perfil no backend
      Frame.topmost().goBack();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  }
}