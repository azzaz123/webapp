import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { UuidService } from '@core/uuid/uuid.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import {
  MOCK_RECOMMENDED_ITEM_CARD,
  MOCK_RECOMMENDED_ITEM_CARD_NON_FAVOURITE,
  MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES,
} from '@fixtures/item-card.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import {
  RECOMMENDED_ITEM_MOCK,
  RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES,
  RECOMMENDED_ITEM_NON_FAVOURITED_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { MapRecommendedItemCardService } from './map-recommended-item-card.service';

describe('MapRecommendedItemCardService', () => {
  let service: MapRecommendedItemCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemFavouritesModule],
      providers: [
        MapRecommendedItemCardService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });
    service = TestBed.inject(MapRecommendedItemCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map items', () => {
    describe('and the item is NOT favourited...', () => {
      it('should return the map recommended items with the favourited flag false', () => {
        const cardsResponse = service.mapRecommendedItemsFavouriteCheck([RECOMMENDED_ITEM_NON_FAVOURITED_MOCK]);

        expect(cardsResponse).toStrictEqual([MOCK_RECOMMENDED_ITEM_CARD_NON_FAVOURITE]);
      });
    });

    describe('and the item is favourited...', () => {
      it('should call and return the map recommended items with the favourited flag true', () => {
        const cardsResponse = service.mapRecommendedItemsFavouriteCheck([RECOMMENDED_ITEM_MOCK]);

        expect(cardsResponse).toStrictEqual([MOCK_RECOMMENDED_ITEM_CARD]);
      });
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the image as null', () => {
        expect(service.mapRecommendedItemsFavouriteCheck([RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES])).toStrictEqual([
          MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES,
        ]);
      });
    });
  });
});
