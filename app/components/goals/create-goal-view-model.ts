import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { GoalsService } from '../../services/goals.service';
import { AuthService } from '../../services/auth.service';

export class CreateGoalViewModel extends Observable {
  private goalsService: GoalsService;
  private authService: AuthService;
  private _name: string = '';
  private _targetAmount: number = 0;
  private _deadline?: Date;
  private _category: string = '';
  private _store: string = '';

  constructor() {
    super();
    this.goalsService = GoalsService.getInstance();
    this.authService = AuthService.getInstance();
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

  get targetAmount(): number {
    return this._targetAmount;
  }

  set targetAmount(value: number) {
    if (this._targetAmount !== value) {
      this._targetAmount = value;
      this.notifyPropertyChange('targetAmount', value);
    }
  }

  get deadline(): Date | undefined {
    return this._deadline;
  }

  set deadline(value: Date | undefined) {
    if (this._deadline !== value) {
      this._deadline = value;
      this.notifyPropertyChange('deadline', value);
    }
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    if (this._category !== value) {
      this._category = value;
      this.notifyPropertyChange('category', value);
    }
  }

  get store(): string {
    return this._store;
  }

  set store(value: string) {
    if (this._store !== value) {
      this._store = value;
      this.notifyPropertyChange('store', value);
    }
  }

  async saveGoal() {
    try {
      const user = this.authService.currentUser;
      if (!user) return;

      await this.goalsService.createGoal({
        userId: user.id,
        name: this._name,
        targetAmount: this._targetAmount,
        currentAmount: 0,
        deadline: this._deadline,
        category: this._category || undefined,
        store: this._store || undefined
      });

      Frame.topmost().goBack();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  }
}