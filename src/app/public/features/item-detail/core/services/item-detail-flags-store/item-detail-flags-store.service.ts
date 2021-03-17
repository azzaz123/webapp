import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag-constants';
import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { MapItemDetailFlagsStoreService } from '../map-item-detail-flags-store/map-item-detail-flags-store.service';

@Injectable()
export class ItemDetailFlagsStoreService {
  constructor(private mapItemDetailFlagsStoreService: MapItemDetailFlagsStoreService) {}

  private readonly _statusFlag = new BehaviorSubject<STATUS_ITEM_FLAG_TYPES>(null);
  private readonly _bumpedFlag = new BehaviorSubject<BUMPED_ITEM_FLAG_TYPES>(null);

  get statusFlag(): STATUS_ITEM_FLAG_TYPES {
    return this._statusFlag.getValue();
  }

  get statusFlag$(): Observable<STATUS_ITEM_FLAG_TYPES> {
    return this._statusFlag.asObservable();
  }

  set statusFlag(statusFlag: STATUS_ITEM_FLAG_TYPES) {
    this._statusFlag.next(statusFlag);
  }

  get bumpedFlag(): BUMPED_ITEM_FLAG_TYPES {
    return this._bumpedFlag.getValue();
  }

  get bumpedFlag$(): Observable<BUMPED_ITEM_FLAG_TYPES> {
    return this._bumpedFlag.asObservable();
  }

  set bumpedFlag(bumpedFlag: BUMPED_ITEM_FLAG_TYPES) {
    this._bumpedFlag.next(bumpedFlag);
  }

  public updateStatusFlag(itemFlags: ItemFlags): void {
    this.statusFlag = this.mapItemDetailFlagsStoreService.mapStatusFlag(itemFlags);
  }

  public updateBumpedFlag(itemVisibilityFlags: ItemVisibilityFlags): void {
    this.bumpedFlag = this.mapItemDetailFlagsStoreService.mapBumpedFlag(itemVisibilityFlags);
  }
}
