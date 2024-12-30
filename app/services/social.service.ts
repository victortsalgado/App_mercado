import { Post, Comment } from '../models/social.model';

export class SocialService {
  private static instance: SocialService;
  private posts: Post[] = [];

  private constructor() {}

  static getInstance(): SocialService {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }
    return SocialService.instance;
  }

  async createPost(post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date()
    };
    
    this.posts.push(newPost);
    return newPost;
  }

  async getPosts(filter?: { type?: Post['type']; store?: string }): Promise<Post[]> {
    let filteredPosts = this.posts;
    
    if (filter?.type) {
      filteredPosts = filteredPosts.filter(post => post.type === filter.type);
    }
    
    if (filter?.store) {
      filteredPosts = filteredPosts.filter(post => post.store === filter.store);
    }
    
    return filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const comment: Comment = {
      id: Date.now().toString(),
      userId,
      content,
      createdAt: new Date()
    };

    post.comments.push(comment);
    return comment;
  }

  async likePost(postId: string): Promise<void> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    post.likes++;
  }
}