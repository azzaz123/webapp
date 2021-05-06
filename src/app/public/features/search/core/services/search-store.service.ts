import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SearchStoreService {
  private static INITIAL_ITEMS_STATE: ItemCard[] = [];
  private static INITIAL_HAS_MORE_STATE: boolean = false;

  private itemsSubject: BehaviorSubject<ItemCard[]> = new BehaviorSubject<ItemCard[]>(SearchStoreService.INITIAL_ITEMS_STATE);
  private hasMoreSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(SearchStoreService.INITIAL_HAS_MORE_STATE);

  public get items$(): Observable<ItemCard[]> {
    return this.itemsSubject.asObservable();
  }

  public get hasMore$(): Observable<boolean> {
    return this.hasMoreSubject.asObservable();
  }

  public getItemCount(): number {
    return this.getItems().length;
  }

  public getItems(): ItemCard[] {
    return this.itemsSubject.getValue();
  }

  public setItems(items: ItemCard[]): void {
    this.itemsSubject.next(items);
  }

  public appendItems(items: ItemCard[]): void {
    this.itemsSubject.next([...this.getItems(), ...items]);
  }

  public clear(): void {
    this.itemsSubject.next(SearchStoreService.INITIAL_ITEMS_STATE);
    this.hasMoreSubject.next(SearchStoreService.INITIAL_HAS_MORE_STATE);
  }

  public setHasMore(hasMore: boolean): void {
    this.hasMoreSubject.next(hasMore);
  }
}
