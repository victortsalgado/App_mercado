import { Observable } from '@nativescript/core';
import { ChallengeService } from '../../services/challenges/challenge.service';
import { AuthService } from '../../services/auth.service';
import { UserChallenge } from '../../models/challenge.model';

export class ChallengesViewModel extends Observable {
  private challengeService: ChallengeService;
  private authService: AuthService;
  private _dailyChallenges: UserChallenge[] = [];
  private _listViewHeight: number = 300;

  constructor() {
    super();
    this.challengeService = ChallengeService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadChallenges();
  }

  get dailyChallenges(): UserChallenge[] {
    return this._dailyChallenges;
  }

  get listViewHeight(): number {
    return this._listViewHeight;
  }

  get completedDaily(): number {
    return this._dailyChallenges.filter(c => c.completed).length;
  }

  get totalDaily(): number {
    return this._dailyChallenges.length;
  }

  async loadChallenges() {
    const user = this.authService.currentUser;
    if (!user) return;

    this._dailyChallenges = await this.challengeService.getUserChallenges(user.id);
    this._listViewHeight = Math.min(this._dailyChallenges.length * 120, 300);

    this.notifyPropertyChange('dailyChallenges', this._dailyChallenges);
    this.notifyPropertyChange('listViewHeight', this._listViewHeight);
    this.notifyPropertyChange('completedDaily', this.completedDaily);
    this.notifyPropertyChange('totalDaily', this.totalDaily);
  }

  async refreshChallenges() {
    await this.loadChallenges();
  }
}