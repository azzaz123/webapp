import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import {
  MOCK_RECOMMENDED_ITEM_CARD,
  MOCK_RECOMMENDED_ITEM_CARD_NON_FAVORITE,
  MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES,
} from '@fixtures/item-card.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavoritesModule } from '@public/core/services/item-favorites/item-favorites.module';
import { ItemFavoritesService } from '@public/core/services/item-favorites/item-favorites.service';
import {
  RECOMMENDED_ITEM_MOCK,
  RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES,
  RECOMMENDED_ITEM_NON_FAVORITED_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { MapRecommendedItemCardService } from './map-recommended-item-card.service';

describe('MapRecommendedItemCardService', () => {
  let service: MapRecommendedItemCardService;
  let uuidService: UuidService;
  let itemFavoritesService: ItemFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemFavoritesModule],
      providers: [
        MapRecommendedItemCardService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(MapRecommendedItemCardService);
    itemFavoritesService = TestBed.inject(ItemFavoritesService);
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValue('1213');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map items and check the favorite...', () => {
    describe('and the item is NOT favorited...', () => {
      it('should call the map recommended items with the favorited flag false', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavoritesService, 'getFavouritedItemIds').and.returnValue(of([]));
        spyOn(service, 'mapRecommendedItems').and.callThrough();

        service
          .mapRecommendedItemsFavoriteCheck([RECOMMENDED_ITEM_NON_FAVORITED_MOCK])
          .subscribe((response: ItemCard[]) => (cardsResponse = response));

        expect(service.mapRecommendedItems).toHaveBeenCalledWith([RECOMMENDED_ITEM_NON_FAVORITED_MOCK]);
        expect(cardsResponse).toStrictEqual([MOCK_RECOMMENDED_ITEM_CARD_NON_FAVORITE]);
      });
    });

    describe('and the item is favorited...', () => {
      it('should call the map recommended items with the favorited flag true', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavoritesService, 'getFavouritedItemIds').and.returnValue(of([RECOMMENDED_ITEM_MOCK.id]));
        spyOn(service, 'mapRecommendedItems').and.callThrough();

        service
          .mapRecommendedItemsFavoriteCheck([RECOMMENDED_ITEM_NON_FAVORITED_MOCK])
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
