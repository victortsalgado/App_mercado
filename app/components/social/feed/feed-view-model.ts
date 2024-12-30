import { Observable } from '@nativescript/core';
import { SocialService } from '../../../services/social.service';
import { Post } from '../../../models/social.model';
import { Frame } from '@nativescript/core';

export class FeedViewModel extends Observable {
  private socialService: SocialService;
  private _posts: Post[] = [];
  private _searchQuery: string = '';
  private _currentFilter: { type?: string; store?: string } = {};

  constructor() {
    super();
    this.socialService = SocialService.getInstance();
    this.loadPosts();
  }

  get posts(): Post[] {
    return this._posts;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.notifyPropertyChange('searchQuery', value);
    }
  }

  async loadPosts() {
    try {
      this._posts = await this.socialService.getPosts(this._currentFilter);
      this.notifyPropertyChange('posts', this._posts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  async onSearch() {
    if (this._searchQuery) {
      this._currentFilter.store = this._searchQuery;
      await this.loadPosts();
    }
  }

  async onClearSearch() {
    this._searchQuery = '';
    delete this._currentFilter.store;
    await this.loadPosts();
  }

  showFilters() {
    Frame.topmost().navigate({
      moduleName: 'components/social/feed/filters-modal',
      context: {
        currentFilter: this._currentFilter,
        onApplyFilters: (filters: typeof this._currentFilter) => {
          this._currentFilter = filters;
          this.loadPosts();
        }
      }
    });
  }
}