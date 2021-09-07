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
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import {
  RECOMMENDED_ITEM_MOCK,
  RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES,
  RECOMMENDED_ITEM_NON_FAVOURITED_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { MapRecommendedItemCardService } from './map-recommended-item-card.service';

describe('MapRecommendedItemCardService', () => {
  let service: MapRecommendedItemCardService;
  let uuidService: UuidService;
  let itemFavouritesService: ItemFavouritesService;

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
    itemFavouritesService = TestBed.inject(ItemFavouritesService);
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValue('1213');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map items and check the favourite...', () => {
    describe('and the item is NOT favourited...', () => {
      it('should call and return the map recommended items with the favourited flag false', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavouritesService, 'getFavouritedItemIds').and.returnValue(of([]));
        spyOn(service, 'mapRecommendedItems').and.callThrough();

        service
          .mapRecommendedItemsFavouriteCheck([RECOMMENDED_ITEM_NON_FAVOURITED_MOCK])
          .subscribe((response: ItemCard[]) => (cardsResponse = response));

        expect(service.mapRecommendedItems).toHaveBeenCalledWith([RECOMMENDED_ITEM_NON_FAVOURITED_MOCK]);
        expect(cardsResponse).toStrictEqual([MOCK_RECOMMENDED_ITEM_CARD_NON_FAVOURITE]);
      });
    });

    describe('and the item is favourited...', () => {
      it('should call and return the map recommended items with the favourited flag true', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavouritesService, 'getFavouritedItemIds').and.returnValue(of([RECOMMENDED_ITEM_MOCK.id]));
        spyOn(service, 'mapRecommendedItems').and.callThrough();

        service
          .mapRecommendedItemsFavouriteCheck([RECOMMENDED_ITEM_NON_FAVOURITED_MOCK])
          .subscribe((response: ItemCard[]) => (cardsResponse = response));

        expect(service.mapRecommendedItems).toHaveBeenCalledWith([RECOMMENDED_ITEM_MOCK]);
        expect(cardsResponse).toStrictEqual([MOCK_RECOMMENDED_ITEM_CARD]);
      });
    });
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {
      expect(service.mapRecommendedItems([RECOMMENDED_ITEM_MOCK, RECOMMENDED_ITEM_MOCK])).toStrictEqual([
        MOCK_RECOMMENDED_ITEM_CARD,
        MOCK_RECOMMENDED_ITEM_CARD,
      ]);
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the image as null', () => {
        expect(service.mapRecommendedItems([RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES])).toStrictEqual([
          MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES,
        ]);
      });
    });
  });
});
