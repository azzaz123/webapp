import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { BehaviorSubject, Observable } from 'rxjs';

export class ItemStoreService {
  private readonly _user = new BehaviorSubject<User>(null);
  private readonly _item = new BehaviorSubject<Item>(null);

  get user(): User {
    return this._user.getValue();
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  set user(user: User) {
    this._user.next(user);
  }

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
