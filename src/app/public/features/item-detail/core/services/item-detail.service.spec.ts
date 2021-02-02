import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CAR_DATA, MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_FULL_USER, USER_DATA } from '@fixtures/user.fixtures.spec';
import { ITEM_COUNTERS_DATA } from '@fixtures/item.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { of } from 'rxjs';
import { ItemDetail } from '../../interfaces/item-detail.interface';

import { ItemDetailService } from './item-detail.service';

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
    });

    it('should ask for the item and return it with correct format', () => {
      let expectedResponse: ItemDetail;
      MOCK_FULL_USER.coverImage = null;

      itemDetailService.getItem(itemId).subscribe((response: ItemDetail) => {
        expectedResponse = response;
      });

      expect(expectedResponse.item).toEqual(item);
      expect(expectedResponse.user).toEqual(MOCK_FULL_USER);
    });
  });

  describe('getRecommendedItems', () => {
    it('should call the itemDetailService getRecommendedItems function', () => {
      spyOn(recommenderApiService, 'getRecommendedItemsByItemId');

      itemDetailService.getRecommendedItems(itemId);

      expect(recommenderApiService.getRecommendedItemsByItemId).toHaveBeenCalledWith(itemId);
    });
  });
});
