import { Injectable } from '@angular/core';
import { Item } from '@core/item/item';
import { ItemCounters, ItemResponse, ItemVisibilityFlags, Purchase } from '@core/item/item-response.interface';
import { User } from '@core/user/user';
import { UserResponse } from '@core/user/user-response.interface';
import { DeleteItemBodyResponse, ReserveItemBodyResponse } from '@public/core/services/api/item/interfaces/item-response.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { RecommendationsApiService } from '@public/core/services/api/recommender/recommendations-api.service';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, mergeMap } from 'rxjs/operators';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';
import { MarkAsFavouriteBodyResponse } from '@public/core/services/api/public-user/interfaces/public-user-response.interface';

@Injectable()
export class ItemDetailService {
  constructor(
    private itemApiService: ItemApiService,
    private publicUserApiService: PublicUserApiService,
    private recommendationsApiService: RecommendationsApiService,
    private mapItemService: MapItemService
  ) {}

  public getItemDetail(itemId: string): Observable<ItemDetailResponse> {
    return this.itemApiService.getItem(itemId).pipe(
      concatMap((item) => {
        return forkJoin([
          this.publicUserApiService.getUser(item.content.seller_id),
          this.itemApiService.getItemCounters(itemId),
          this.itemApiService.getBumpFlags(itemId),
        ]).pipe(
          mergeMap(([user, itemCounters, bumpFlags]) => {
            item.content.user = this.mapUser(user);

            return of({
              item: this.mapItem(item, itemCounters, bumpFlags),
              user: this.mapUser(user),
            });
          })
        );
      })
    );
  }

  public getRecommendedItems(itemId: string): Observable<RecommendedItemsBodyResponse> {
    return this.recommendationsApiService.getRecommendedItemsByItemId(itemId);
  }

  public deleteItem(itemId: string): Observable<DeleteItemBodyResponse> {
    return this.itemApiService.deleteItem(itemId);
  }

  public reserveItem(itemId: string, reserved: boolean): Observable<ReserveItemBodyResponse> {
    return this.itemApiService.reserveItem(itemId, reserved);
  }

  public markAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.markAsFavourite(id);
  }

  public unmarkAsFavourite(id: string): Observable<MarkAsFavouriteBodyResponse> {
    return this.itemApiService.unmarkAsFavourite(id);
  }

  public getItemActivePurchases(id: string): Observable<Purchase[]> {
    return this.itemApiService.getItemActivePurchases(id);
  }

  private mapItem(itemResponse: ItemResponse, itemCounters: ItemCounters, bumpFlags: ItemVisibilityFlags): Item {
    const item = this.mapItemService.mapItem(itemResponse);
    item.views = itemCounters.views;
    item.favorites = itemCounters.favorites;
    item.bumpFlags = bumpFlags;

    return item;
  }

  private mapUser(userData: UserResponse): User {
    return new User(
      userData.id,
      userData.micro_name,
      userData.image,
      userData.location,
      userData.stats,
      userData.validations,
      userData.verification_level,
      userData.scoring_stars,
      userData.scoring_starts,
      userData.response_rate,
      userData.online,
      userData.type,
      userData.received_reports,
      userData.web_slug,
      userData.first_name,
      userData.last_name,
      userData.birth_date,
      userData.gender,
      userData.email,
      userData.featured,
      userData.extra_info,
      null,
      userData.register_date
    );
  }
}
