import { Observable } from '@nativescript/core';
import { SocialService } from '../../services/social.service';
import { Frame } from '@nativescript/core';

export class SharePostViewModel extends Observable {
  private socialService: SocialService;
  private _type: 'DEAL' | 'REVIEW' | 'PRICE_ALERT';
  private _store: string = '';
  private _content: string = '';
  private _productName: string = '';
  private _price: number = 0;
  private _selectedType: number = 0;

  constructor(params: {
    type: 'DEAL' | 'REVIEW' | 'PRICE_ALERT',
    store: string,
    initialContent?: string,
    productName?: string,
    price?: number
  }) {
    super();
    this.socialService = SocialService.getInstance();
    this._type = params.type;
    this._store = params.store;
    this._content = params.initialContent || '';
    this._productName = params.productName || '';
    this._price = params.price || 0;
    this._selectedType = this.getTypeIndex(params.type);
  }

  get type(): string {
    return this._type;
  }

  get store(): string {
    return this._store;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    if (this._content !== value) {
      this._content = value;
      this.notifyPropertyChange('content', value);
    }
  }

  get productName(): string {
    return this._productName;
  }

  set productName(value: string) {
    if (this._productName !== value) {
      this._productName = value;
      this.notifyPropertyChange('productName', value);
    }
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (this._price !== value) {
      this._price = value;
      this.notifyPropertyChange('price', value);
    }
  }

  get selectedType(): number {
    return this._selectedType;
  }

  set selectedType(value: number) {
    if (this._selectedType !== value) {
      this._selectedType = value;
      this._type = this.getTypeFromIndex(value);
      this.notifyPropertyChange('selectedType', value);
      this.notifyPropertyChange('type', this._type);
    }
  }

  async publishPost() {
    try {
      await this.socialService.createPost({
        type: this._type,
        store: this._store,
        content: this._content,
        productName: this._type === 'DEAL' ? this._productName : undefined,
        price: this._type === 'DEAL' ? this._price : undefined
      });

      Frame.topmost().goBack();
    } catch (error) {
      console.error('Erro ao publicar:', error);
      // TODO: Mostrar mensagem de erro
    }
  }

  private getTypeIndex(type: string): number {
    switch (type) {
      case 'DEAL': return 0;
      case 'REVIEW': return 1;
      case 'PRICE_ALERT': return 2;
      default: return 0;
    }
  }

  private getTypeFromIndex(index: number): 'DEAL' | 'REVIEW' | 'PRICE_ALERT' {
    switch (index) {
      case 0: return 'DEAL';
      case 1: return 'REVIEW';
      case 2: return 'PRICE_ALERT';
      default: return 'DEAL';
    }
  }
}