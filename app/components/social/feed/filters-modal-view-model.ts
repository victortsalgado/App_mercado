import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';

export class FiltersModalViewModel extends Observable {
  private _postTypes = ['Todos', 'Promoções', 'Avaliações', 'Alertas de Preço'];
  private _sortOptions = ['Mais Recentes', 'Mais Curtidos', 'Mais Comentados'];
  private _selectedTypeIndex: number = 0;
  private _selectedSortIndex: number = 0;
  private onApplyFilters: Function;

  constructor(params: {
    currentFilter: { type?: string },
    onApplyFilters: Function
  }) {
    super();
    this.onApplyFilters = params.onApplyFilters;
    
    if (params.currentFilter.type) {
      this._selectedTypeIndex = this.getTypeIndex(params.currentFilter.type);
    }
  }

  get postTypes(): string[] {
    return this._postTypes;
  }

  get sortOptions(): string[] {
    return this._sortOptions;
  }

  get selectedTypeIndex(): number {
    return this._selectedTypeIndex;
  }

  set selectedTypeIndex(value: number) {
    if (this._selectedTypeIndex !== value) {
      this._selectedTypeIndex = value;
      this.notifyPropertyChange('selectedTypeIndex', value);
    }
  }

  get selectedSortIndex(): number {
    return this._selectedSortIndex;
  }

  set selectedSortIndex(value: number) {
    if (this._selectedSortIndex !== value) {
      this._selectedSortIndex = value;
      this.notifyPropertyChange('selectedSortIndex', value);
    }
  }

  applyFilters() {
    const filters: { type?: string; sort?: string } = {};
    
    if (this._selectedTypeIndex > 0) {
      filters.type = this.getTypeFromIndex(this._selectedTypeIndex);
    }

    this.onApplyFilters(filters);
    this.close();
  }

  clearFilters() {
    this._selectedTypeIndex = 0;
    this._selectedSortIndex = 0;
    this.notifyPropertyChange('selectedTypeIndex', 0);
    this.notifyPropertyChange('selectedSortIndex', 0);
  }

  close() {
    Frame.topmost().goBack();
  }

  private getTypeIndex(type: string): number {
    switch (type) {
      case 'DEAL': return 1;
      case 'REVIEW': return 2;
      case 'PRICE_ALERT': return 3;
      default: return 0;
    }
  }

  private getTypeFromIndex(index: number): string {
    switch (index) {
      case 1: return 'DEAL';
      case 2: return 'REVIEW';
      case 3: return 'PRICE_ALERT';
      default: return '';
    }
  }
}