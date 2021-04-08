import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { ReserveItemBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { MapItemDetailStoreService } from '../map-item-detail-store/map-item-detail-store.service';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { Item } from '@core/item/item';
import { ItemDetailFlagsStoreService } from '../item-detail-flags-store/item-detail-flags-store.service';
import { MarkAsFavouriteBodyResponse } from '@public/core/services/api/public-user/interfaces/public-user-response.interface';

@Injectable()
export class ItemDetailStoreService {
  constructor(
    private itemDetailService: ItemDetailService,
    private mapItemDetailStoreService: MapItemDetailStoreService,
    private router: Router,
    private itemDetailFlagsStoreService: ItemDetailFlagsStoreService
  ) {}

  private readonly _itemDetail = new BehaviorSubject<ItemDetail>(null);

  get itemDetail(): ItemDetail {
    return this._itemDetail.getValue();
  }

  get itemDetail$(): Observable<ItemDetail> {
    return this._itemDetail.asObservable();
  }

  set itemDetail(itemDetail: ItemDetail) {
    this._itemDetail.next(itemDetail);
  }

  public initializeItemAndFlags(itemId: string): void {
    this.itemDetailService.getItemDetail(itemId).subscribe(
      (itemDetail: ItemDetailResponse) => {
        this.itemDetail = this.mapItemDetailStoreService.mapItemDetailStore(itemDetail);
        this.itemDetailFlagsStoreService.updateStatusFlag(itemDetail.item.flags);
        this.itemDetailFlagsStoreService.updateBumpedFlag(itemDetail.item.bumpFlags);
      },
      () => this.router.navigate([`/${PUBLIC_PATHS.NOT_FOUND}`])
    );
  }

  public toggleReservedItem(): Observable<ReserveItemBodyResponse> {
    if (this.itemDetail.item.reserved) {
      return this.unmarkAsReserved();
    } else {
      return this.markItemAsReserved();
    }
  }

  public toggleFavouriteItem(): Observable<MarkAsFavouriteBodyResponse> {
    if (this.itemDetail.item.flags.favorite) {
      return this.unmarkAsFavourite();
    } else {
      return this.markAsFavourite();
    }
  }

  public markItemAsSold(): void {
    const item = this.itemDetail.item;
    item.sold = true;
    this.updateStatusFlags(item);
  }

  private markItemAsReserved(): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(this.itemDetail.item.id, true).pipe(
      tap(() => {
        this.reserveItemAndUpdateStatusFlag(true);
      })
    );
  }

  private unmarkAsReserved(): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(this.itemDetail.item.id, false).pipe(
      tap(() => {
        this.reserveItemAndUpdateStatusFlag(false);
      })
    );
  }

  private markAsFavourite(): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemDetailService.markAsFavourite(this.itemDetail.item.id).pipe(
      tap(() => {
        this.favouriteItem(true);
      })
    );
  }

  private unmarkAsFavourite(): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemDetailService.unmarkAsFavourite(this.itemDetail.item.id).pipe(
      tap(() => {
        this.favouriteItem(false);
      })
    );
  }

  private reserveItemAndUpdateStatusFlag(isReserved: boolean): void {
    const item = this.itemDetail.item;
    item.reserved = isReserved;
    this.updateStatusFlags(item);
  }

  private favouriteItem(isFavourited: boolean): void {
    const item = this.itemDetail.item;
    item.flags.favorite = isFavourited;
    this.updateStatusFlags(item);
  }

  private updateStatusFlags(item: Item): void {
    this.itemDetail = { ...this.itemDetail, item };
    this.itemDetailFlagsStoreService.updateStatusFlag(item.flags);
  }
}
