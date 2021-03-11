import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SearchItem } from '../../interfaces/search-item.interface';

@Injectable()
export class SearchStoreService {
  private itemsSubject = new BehaviorSubject<SearchItem[]>([]);

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
