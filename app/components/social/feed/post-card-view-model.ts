import { Observable } from '@nativescript/core';
import { Post, Comment } from '../../../models/social.model';
import { SocialService } from '../../../services/social.service';

export class PostCardViewModel extends Observable {
  private socialService: SocialService;
  private _post: Post;
  private _showComments: boolean = false;
  private _newComment: string = '';
  private _commentListHeight: number = 150;

  constructor(post: Post) {
    super();
    this._post = post;
    this.socialService = SocialService.getInstance();
  }

  get post(): Post {
    return this._post;
  }

  get showComments(): boolean {
    return this._showComments;
  }

  get newComment(): string {
    return this._newComment;
  }

  set newComment(value: string) {
    if (this._newComment !== value) {
      this._newComment = value;
      this.notifyPropertyChange('newComment', value);
    }
  }

  get commentListHeight(): number {
    return this._commentListHeight;
  }

  async onLike() {
    try {
      await this.socialService.likePost(this._post.id);
      this._post.likes++;
      this.notifyPropertyChange('post', this._post);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  }

  toggleComments() {
    this._showComments = !this._showComments;
    this.notifyPropertyChange('showComments', this._showComments);
  }

  async addComment() {
    if (!this._newComment.trim()) return;

    try {
      const comment = await this.socialService.addComment(
        this._post.id,
        'user123', // TODO: Pegar do AuthService
        this._newComment
      );

      this._post.comments.push(comment);
      this._newComment = '';
      this.notifyPropertyChange('post', this._post);
      this.notifyPropertyChange('newComment', this._newComment);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  }
}