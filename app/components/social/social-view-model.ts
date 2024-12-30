import { Observable } from '@nativescript/core';
import { SocialService } from '../../services/social.service';
import { Post } from '../../models/social.model';

export class SocialViewModel extends Observable {
  private _posts: Post[] = [];
  private socialService: SocialService;

  constructor() {
    super();
    this.socialService = SocialService.getInstance();
    this.loadPosts();
  }

  async loadPosts() {
    this._posts = await this.socialService.getPosts();
    this.notifyPropertyChange('posts', this._posts);
  }

  get posts(): Post[] {
    return this._posts;
  }

  async createPost(content: string, type: Post['type'], store: string) {
    const post = await this.socialService.createPost({
      userId: 'user123', // TODO: Implementar autenticação
      type,
      store,
      content
    });
    
    this._posts.unshift(post);
    this.notifyPropertyChange('posts', this._posts);
  }

  async likePost(postId: string) {
    await this.socialService.likePost(postId);
    const post = this._posts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      this.notifyPropertyChange('posts', this._posts);
    }
  }

  async addComment(postId: string, content: string) {
    const comment = await this.socialService.addComment(postId, 'user123', content);
    const post = this._posts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      this.notifyPropertyChange('posts', this._posts);
    }
  }
}