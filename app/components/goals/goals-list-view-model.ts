import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { GoalsService } from '../../services/goals.service';
import { AuthService } from '../../services/auth.service';
import { SavingsGoal } from '../../models/goals.model';

export class GoalsListViewModel extends Observable {
  private goalsService: GoalsService;
  private authService: AuthService;
  private _goals: SavingsGoal[] = [];

  constructor() {
    super();
    this.goalsService = GoalsService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadGoals();
  }

  private async loadGoals() {
    const user = this.authService.currentUser;
    if (!user) return;

    this._goals = await this.goalsService.getUserGoals(user.id);
    this._goals = this._goals.map(goal => ({
      ...goal,
      progress: this.goalsService.getGoalProgress(goal)
    }));

    this.notifyPropertyChange('goals', this._goals);
    this.notifyPropertyChange('activeGoals', this.activeGoals);
    this.notifyPropertyChange('completedGoals', this.completedGoals);
  }

  get goals(): SavingsGoal[] {
    return this._goals;
  }

  get activeGoals(): number {
    return this._goals.filter(g => !g.completed).length;
  }

  get completedGoals(): number {
    return this._goals.filter(g => g.completed).length;
  }

  getDaysRemainingText(days?: number): string {
    if (!days) return '';
    if (days < 0) return 'Meta atrasada';
    return `${days} dias restantes`;
  }

  createGoal() {
    Frame.topmost().navigate({
      moduleName: 'components/goals/create-goal'
    });
  }
}