import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { ReserveItemBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { MapItemDetailStoreService } from '../map-item-detail-store/map-item-detail-store.service';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ItemDetailStoreService {
  constructor(
    private itemDetailService: ItemDetailService,
    private mapItemDetailStoreService: MapItemDetailStoreService,
    private socialMetaTagsService: SocialMetaTagService
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

  public initializeItem(itemDetail: ItemDetailResponse): void {
    this.itemDetail = this.mapItemDetailStoreService.mapItemDetailStore(itemDetail);
  }

  public markItemAsReserved(itemUUID: string): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(itemUUID, true).pipe(
      tap(() => {
        this.itemDetail.item.reserved = true;
      })
    );
  }

  public markItemAsUnreserved(itemUUID: string): Observable<ReserveItemBodyResponse> {
    return this.itemDetailService.reserveItem(itemUUID, false).pipe(
      tap(() => {
        this.itemDetail.item.reserved = false;
      })
    );
  }

  public markItemAsSold(): void {
    this.itemDetail.item.sold = true;
  }

  public initializeItemMetaTags(): void {
    this.socialMetaTagsService.insertTwitterMetaTags(
      this.itemDetail?.item.title,
      this.itemDetail?.item.description,
      this.itemDetail?.item.mainImage?.urls_by_size?.medium
    );
    this.socialMetaTagsService.insertFacebookMetaTags(
      this.itemDetail?.item.title,
      this.itemDetail?.item.description,
      this.itemDetail?.item.mainImage?.urls_by_size?.medium,
      this.itemDetail?.item.webLink
    );
  }
}
