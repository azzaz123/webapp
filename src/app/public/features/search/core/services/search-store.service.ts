import { Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SearchStoreService {
  private static INITIAL_STATE: ItemCard[] = [];

  private itemsSubject = new BehaviorSubject<ItemCard[]>(SearchStoreService.INITIAL_STATE);

  public get items$(): Observable<ItemCard[]> {
    return this.itemsSubject.asObservable();
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
    this.itemsSubject.next(SearchStoreService.INITIAL_STATE);
  }
}
