import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CAR_DATA, MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_FULL_USER, MOCK_FULL_USER_WITOUT_PHONE, USER_DATA } from '@fixtures/user.fixtures.spec';
import { ITEM_COUNTERS_DATA, ITEM_BUMP_FLAGS } from '@fixtures/item.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { of } from 'rxjs';
import { ItemDetailService } from './item-detail.service';
import { ItemDetailResponse } from '@public/features/item-detail/interfaces/item-detail-response.interface';

describe('ItemDetailService', () => {
  let itemDetailService: ItemDetailService;
  let itemApiService: ItemApiService;
  let publicUserApiService: PublicUserApiService;
  let recommenderApiService: RecommenderApiService;
  let mapItemService: MapItemService;
  const itemId = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemDetailService,
        {
          provide: ItemApiService,
          useValue: {
            getItem() {
              return of(CAR_DATA);
            },
            getItemCounters() {
              return of(ITEM_COUNTERS_DATA);
            },
            getBumpFlags() {
              return of(ITEM_BUMP_FLAGS);
            },
            reserveItem() {
              return of();
            },
            deleteItem() {
              return of();
            },
            getItemActivePurchases() {
              return of();
            },
            markAsFavourite() {
              return of();
            },
            unmarkAsFavourite() {
              return of();
            },
          },
        },
        {
          provide: PublicUserApiService,
          useValue: {
            getUser() {
              return of(USER_DATA);
            },
          },
        },
        RecommenderApiService,
        MapItemService,
      ],
      imports: [HttpClientTestingModule],
    });
    itemDetailService = TestBed.inject(ItemDetailService);
    itemApiService = TestBed.inject(ItemApiService);
    publicUserApiService = TestBed.inject(PublicUserApiService);
    recommenderApiService = TestBed.inject(RecommenderApiService);
    mapItemService = TestBed.inject(MapItemService);
  });

  it('should be created', () => {
    expect(itemDetailService).toBeTruthy();
  });

  describe('getItem', () => {
    const item = MOCK_CAR;
    beforeEach(() => {
      item.views = ITEM_COUNTERS_DATA.views;
      item.favorites = ITEM_COUNTERS_DATA.favorites;
      item.bumpFlags = ITEM_BUMP_FLAGS;
    });

    it('should ask for the item and return it with correct format', () => {
      let expectedResponse: ItemDetailResponse;
      MOCK_FULL_USER_WITOUT_PHONE.coverImage = null;

      itemDetailService.getItemDetail(itemId).subscribe((response: ItemDetailResponse) => {
        expectedResponse = response;
      });

      expect(expectedResponse.item).toEqual(item);
      expect(expectedResponse.item.bumpFlags).toEqual(ITEM_BUMP_FLAGS);
      expect(expectedResponse.user).toEqual(MOCK_FULL_USER_WITOUT_PHONE);
    });
  });

  describe('getRecommendedItems', () => {
    it('should call the recommenderApiService getRecommendedItems function', () => {
      spyOn(recommenderApiService, 'getRecommendedItemsByItemId');

      itemDetailService.getRecommendedItems(itemId);

      expect(recommenderApiService.getRecommendedItemsByItemId).toHaveBeenCalledWith(itemId);
    });
  });

  describe('deleteItem', () => {
    it('should call the itemApiService deleteItem function', () => {
      spyOn(itemApiService, 'deleteItem');

      itemDetailService.deleteItem(itemId);

      expect(itemApiService.deleteItem).toHaveBeenCalledWith(itemId);
    });
  });

  describe('reserveItem', () => {
    it('should call the itemApiService deleteItem function', () => {
      spyOn(itemApiService, 'reserveItem');

      itemDetailService.reserveItem(itemId, true);

      expect(itemApiService.reserveItem).toHaveBeenCalledWith(itemId, true);
    });
  });

  describe('markAsFavourite', () => {
    it('should call the itemApiService markAsFavourite function', () => {
      spyOn(itemApiService, 'markAsFavourite');

      itemDetailService.markAsFavourite(itemId);

      expect(itemApiService.markAsFavourite).toHaveBeenCalledWith(itemId);
    });
  });

  describe('unmarkAsFavourite', () => {
    it('should call the itemApiService unmarkAsFavourite function', () => {
      spyOn(itemApiService, 'unmarkAsFavourite');

      itemDetailService.unmarkAsFavourite(itemId);

      expect(itemApiService.unmarkAsFavourite).toHaveBeenCalledWith(itemId);
    });
  });

  describe('getItemActivePurchase', () => {
    it('should call the itemApiService getItemActivePurchase function', () => {
      spyOn(itemApiService, 'getItemActivePurchases');

      itemDetailService.getItemActivePurchases(itemId);

      expect(itemApiService.getItemActivePurchases).toHaveBeenCalledWith(itemId);
    });
  });
});
