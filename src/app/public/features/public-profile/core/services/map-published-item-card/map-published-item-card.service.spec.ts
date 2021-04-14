import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import {
  MOCK_PUBLISHED_ITEM_CARD,
  MOCK_PUBLISHED_ITEM_CARD_FAVOURITED,
  MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES,
} from '@fixtures/item-card.fixtures.spec';
import { MOCK_ITEM_RESPONSE, MOCK_ITEM_RESPONSE_FAVOURITED } from '@fixtures/item.fixtures.spec';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { MapPublishedItemCardService } from './map-published-item-card.service';

describe('MapPublishedItemCardService', () => {
  let service: MapPublishedItemCardService;
  let uuidService: UuidService;
  let itemFavouritesService: ItemFavouritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemFavouritesModule],
      providers: [
        MapPublishedItemCardService,
        UuidService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(MapPublishedItemCardService);
    uuidService = TestBed.inject(UuidService);
    itemFavouritesService = TestBed.inject(ItemFavouritesService);
    spyOn(uuidService, 'getUUID').and.returnValue('1213');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map items and check the favourite...', () => {
    describe('and the item is NOT favourited...', () => {
      it('should call and return the map published items with the favourited flag false', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavouritesService, 'getFavouritedItemIds').and.returnValue(of([]));
        spyOn(service, 'mapPublishedItems').and.callThrough();

        service.mapPublishedItemsFavouriteCheck([MOCK_ITEM_RESPONSE]).subscribe((response: ItemCard[]) => (cardsResponse = response));

        expect(service.mapPublishedItems).toHaveBeenCalledWith([MOCK_ITEM_RESPONSE]);
        expect(cardsResponse).toStrictEqual([MOCK_PUBLISHED_ITEM_CARD]);
      });
    });

    describe('and the item is favourited...', () => {
      it('should call and return the map published items with the favourited flag true', () => {
        let cardsResponse: ItemCard[];
        spyOn(itemFavouritesService, 'getFavouritedItemIds').and.returnValue(of([MOCK_ITEM_RESPONSE.id]));
        spyOn(service, 'mapPublishedItems').and.callThrough();

        service.mapPublishedItemsFavouriteCheck([MOCK_ITEM_RESPONSE]).subscribe((response: ItemCard[]) => (cardsResponse = response));

        expect(service.mapPublishedItems).toHaveBeenCalledWith([MOCK_ITEM_RESPONSE_FAVOURITED]);
        expect(cardsResponse).toStrictEqual([MOCK_PUBLISHED_ITEM_CARD_FAVOURITED]);
      });
    });
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {
      expect(service.mapPublishedItems([MOCK_ITEM_RESPONSE, MOCK_ITEM_RESPONSE])).toStrictEqual([
        MOCK_PUBLISHED_ITEM_CARD,
        MOCK_PUBLISHED_ITEM_CARD,
      ]);
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the content image as main image', () => {
        const MOCK_ITEM_RESPONSE_WITHOUT_IMAGE = MOCK_ITEM_RESPONSE;
        MOCK_ITEM_RESPONSE_WITHOUT_IMAGE.content.images = [];

        expect(service.mapPublishedItems([MOCK_ITEM_RESPONSE_WITHOUT_IMAGE, MOCK_ITEM_RESPONSE_WITHOUT_IMAGE])).toStrictEqual([
          MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES,
          MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES,
        ]);
      });
    });
  });
});
