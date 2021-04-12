import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { ItemFavoritesModule } from '@public/core/services/item-favorites/item-favorites.module';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { RECOMMENDED_ITEMS_MOCK } from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { MapRecommendedItemCardService } from '../map-recommended-item-card/map-recommended-item-card.service';
import { RecommenderItemCardFavouriteCheckedService } from './recommender-item-card-favorite-checked.service';

describe('RecommenderItemCardFavouriteCheckedService', () => {
  const MOCK_ITEM_ID = '234';
  let service: RecommenderItemCardFavouriteCheckedService;
  let itemDetailService: ItemDetailService;
  let mapRecommendedItemCardService: MapRecommendedItemCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ItemFavoritesModule],
      providers: [
        RecommenderItemCardFavouriteCheckedService,
        ItemDetailService,
        ItemApiService,
        PublicUserApiService,
        RecommenderApiService,
        MapItemService,
        MapRecommendedItemCardService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(RecommenderItemCardFavouriteCheckedService);
    itemDetailService = TestBed.inject(ItemDetailService);
    mapRecommendedItemCardService = TestBed.inject(MapRecommendedItemCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the recommender item cards checking the favorite...', () => {
    beforeEach(() => {
      spyOn(itemDetailService, 'getRecommendedItems').and.returnValue(of(RECOMMENDED_ITEMS_MOCK));
      spyOn(mapRecommendedItemCardService, 'mapRecommendedItemsFavoriteCheck').and.returnValue(of([MOCK_ITEM_CARD]));
    });

    it('should return the recommender type and the recommended items', () => {
      let itemCardsWithRecommenedType: ItemCardsWithRecommenedType;

      service.getItems(MOCK_ITEM_ID).subscribe((response) => (itemCardsWithRecommenedType = response));

      expect(itemCardsWithRecommenedType.recommendedType).toBe(RECOMMENDED_ITEMS_MOCK.recommended_type);
      expect(itemCardsWithRecommenedType.recommendedItems).toStrictEqual([MOCK_ITEM_CARD]);
    });
  });
});
