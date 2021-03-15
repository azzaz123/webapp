import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SearchItem } from '../../interfaces/search-item.interface';
import { MOCK_SEARCH_ITEM } from '@fixtures/search-items.fixtures';

@Injectable()
export class SearchStoreService {
  private itemsSubject = new BehaviorSubject<SearchItem[]>([]);

  // TODO: This will disappear when the integration is done
  constructor() {
    const items = Array(10).fill(MOCK_SEARCH_ITEM);
    this.setItems(items);
    setTimeout(() => {
      this.appendItems(items);
    }, 2000);
  }

  public get items$(): Observable<SearchItem[]> {
    return this.itemsSubject.asObservable();
  }

  public getItemCount(): number {
    return this.getItems().length;
  }

  public getItems(): SearchItem[] {
    return this.itemsSubject.getValue();
  }

  public setItems(items: SearchItem[]): void {
    this.itemsSubject.next(items);
  }

  public appendItems(items: SearchItem[]): void {
    this.itemsSubject.next([...this.getItems(), ...items]);
  }
}
