import { Injectable } from '@angular/core';
import { ItemDetailService } from '@public/features/item-detail/core/services/item-detail/item-detail.service';
import { MapRecommendedItemCardService } from '@public/features/item-detail/core/services/map-recommended-item-card/map-recommended-item-card.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { ItemCard, ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';

@Injectable()
export class RecommenderItemCardFavouriteCheckedService {
  constructor(private itemDetailService: ItemDetailService, private mapRecommendedItemCardService: MapRecommendedItemCardService) {}

  public getItems(itemId: string): Observable<ItemCardsWithRecommenedType> {
    return this.itemDetailService.getRecommendedItems(itemId).pipe(
      switchMap((response: RecommendedItemsBodyResponse) => {
        return forkJoin([
          of(response.recommended_type),
          this.mapRecommendedItemCardService.mapRecommendedItemsFavouriteCheck(response.recommended_items),
        ]).pipe(
          map(([recommendedType, recommendedItems]: [RECOMMENDER_TYPE, ItemCard[]]) => {
            return {
              recommendedType,
              recommendedItems,
            };
          })
        );
      })
    );
  }
}
