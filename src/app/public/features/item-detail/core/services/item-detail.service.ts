import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { User } from '@core/user/user';
import { UserResponse } from '@core/user/user-response.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { Observable, of } from 'rxjs';
import { concatMap, mergeMap } from 'rxjs/operators';
import { ItemDetail } from '../../interfaces/item-detail.interface';

@Injectable()
export class ItemDetailService {
  constructor(
    private itemApiService: ItemApiService,
    private publicUserApiService: PublicUserApiService,
    private recommenderApiService: RecommenderApiService,
    private mapItemService: MapItemService
  ) {}

  public getItem(itemId: string): Observable<ItemDetail> {
    return this.itemApiService.getItem(itemId).pipe(
      concatMap((item: ItemResponse) => {
        return this.publicUserApiService.getUser(item.content.seller_id).pipe(
          mergeMap((user: UserResponse) => {
            item.content.user = this.mapUser(user);
            return of({
              item: this.mapItemService.mapItem(item),
              user: this.mapUser(user),
            });
          })
        );
      })
    );
  }

  public getRecommendedItems(
    itemId: string
  ): Observable<RecommendedItemsBodyResponse> {
    return this.recommenderApiService.getRecommendedItemsByItemId(itemId);
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
