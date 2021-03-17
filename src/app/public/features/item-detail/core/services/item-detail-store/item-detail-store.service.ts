import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { ReserveItemBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { MapItemDetailStoreService } from '../map-item-detail-store/map-item-detail-store.service';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APP_PATHS } from 'app/app-routing-constants';

@Injectable()
export class ItemDetailStoreService {
  constructor(
    private itemDetailService: ItemDetailService,
    private mapItemDetailStoreService: MapItemDetailStoreService,
    private router: Router
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

  public initializeItem(itemId: string): void {
    this.itemDetailService
      .getItem(itemId)
      .pipe(
        tap((itemDetail: ItemDetailResponse) => {
          this.itemDetail = this.mapItemDetailStoreService.mapItemDetailStore(itemDetail);
        }),
        catchError(() => this.router.navigate([`/${APP_PATHS.NOT_FOUND}`]))
      )
      .subscribe();
  }

  public markItemAsReserved(): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(this.itemDetail.item.id, true).pipe(
      tap(() => {
        this.itemDetail.item.reserved = true;
      })
    );
  }

  public markItemAsUnreserved(): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(this.itemDetail.item.id, false).pipe(
      tap(() => {
        this.itemDetail.item.reserved = false;
      })
    );
  }

  public markItemAsSold(): void {
    this.itemDetail.item.sold = true;
  }
}
