import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { ItemFavoritesModule } from '@public/core/services/item-favorites/item-favorites.module';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { CookieService } from 'ngx-cookie';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { MapRecommendedItemCardService } from '../map-recommended-item-card/map-recommended-item-card.service';
import { RecommenderItemCardFavouriteCheckedService } from './recommender-item-card-favorite-checked.service';

describe('RecommenderItemCardFavouriteCheckedService', () => {
  let service: RecommenderItemCardFavouriteCheckedService;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
