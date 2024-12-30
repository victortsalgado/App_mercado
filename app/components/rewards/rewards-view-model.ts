import { Observable } from '@nativescript/core';
import { RewardsService } from '../../services/rewards.service';
import { AuthService } from '../../services/auth.service';
import { UserRewards, Reward, RewardType } from '../../models/rewards.model';

export class RewardsViewModel extends Observable {
  private rewardsService: RewardsService;
  private authService: AuthService;
  private _userRewards: UserRewards | null = null;
  private _achievements: Reward[] = [];

  constructor() {
    super();
    this.rewardsService = RewardsService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadRewards();
  }

  private async loadRewards() {
    const user = this.authService.currentUser;
    if (!user) return;

    this._userRewards = await this.rewardsService.getUserRewards(user.id);
    this._achievements = this._userRewards.rewards;

    this.notifyPropertyChange('userRewards', this._userRewards);
    this.notifyPropertyChange('achievements', this._achievements);
  }

  get userRewards(): UserRewards | null {
    return this._userRewards;
  }

  get achievements(): Reward[] {
    return this._achievements;
  }

  getTypeEmoji(type: RewardType): string {
    switch (type) {
      case 'GOAL_COMPLETED': return '🎯';
      case 'SAVINGS_MILESTONE': return '💰';
      case 'STREAK': return '🔥';
      case 'FIRST_RECEIPT': return '🧾';
      default: return '🏆';
    }
  }
}