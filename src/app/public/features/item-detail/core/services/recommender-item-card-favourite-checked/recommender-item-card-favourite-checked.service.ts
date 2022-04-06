import { Injectable } from '@angular/core';
import { ItemDetailService } from '@public/features/item-detail/core/services/item-detail/item-detail.service';
import { MapRecommendedItemCardService } from '@public/features/item-detail/core/services/map-recommended-item-card/map-recommended-item-card.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';

@Injectable()
export class RecommenderItemCardFavouriteCheckedService {
  constructor(private itemDetailService: ItemDetailService, private mapRecommendedItemCardService: MapRecommendedItemCardService) {}

  public getItems(itemId: string): Observable<ItemCardsWithRecommenedType> {
    return this.itemDetailService.getRecommendedItems(itemId).pipe(
      map((response: RecommendedItemsBodyResponse) => {
        return {
          recommendedType: response.meta?.recommended?.type,
          recommendedItems: this.mapRecommendedItemCardService.mapRecommendedItemsFavouriteCheck(response.data),
        };
      })
    );
  }
}
