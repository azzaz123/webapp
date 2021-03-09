import { Item } from '@core/item/item';
import { BehaviorSubject, Observable } from 'rxjs';

export class ItemStoreService {
  private readonly _item = new BehaviorSubject<Item>(null);

  get item(): Item {
    return this._item.getValue();
  }

  get item$(): Observable<Item> {
    return this._item.asObservable();
  }

  set item(item: Item) {
    this._item.next(item);
  }
}
