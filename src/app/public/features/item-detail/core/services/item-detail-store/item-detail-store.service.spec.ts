import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MOCK_ITEM_DETAIL_RESPONSE } from '@fixtures/item-detail-response.fixtures.spec';
import { MOCK_CAR_ITEM_DETAIL } from '@fixtures/item-detail.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { APP_PATHS } from 'app/app-routing-constants';
import { of, throwError } from 'rxjs';
import { ItemDetailFlagsStoreService } from '../item-detail-flags-store/item-detail-flags-store.service';
import { ItemDetailService } from '../item-detail/item-detail.service';
import { MapItemDetailStoreService } from '../map-item-detail-store/map-item-detail-store.service';

import { ItemDetailStoreService } from './item-detail-store.service';

describe('ItemDetailStoreService', () => {
  let service: ItemDetailStoreService;
  let mapItemDetailStoreService: MapItemDetailStoreService;
  let itemDetailService: ItemDetailService;
  let itemDetailFlagsStoreService: ItemDetailFlagsStoreService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemDetailStoreService,
        PublicUserApiService,
        RecommenderApiService,
        ItemDetailService,
        ItemApiService,
        MapItemService,
        {
          provide: MapItemDetailStoreService,
          useValue: {
            mapItemDetailStore: () => {
              return MOCK_CAR_ITEM_DETAIL;
            },
          },
        },
        {
          provide: ItemDetailFlagsStoreService,
          useValue: {
            updateStatusFlag: () => {},
            updateBumpedFlag: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });

    service = TestBed.inject(ItemDetailStoreService);
    router = TestBed.inject(Router);
    mapItemDetailStoreService = TestBed.inject(MapItemDetailStoreService);
    itemDetailFlagsStoreService = TestBed.inject(ItemDetailFlagsStoreService);
    itemDetailService = TestBed.inject(ItemDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the itemDetail...', () => {
    beforeEach(() => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;
    });

    it('should update the item detail', () => {
      expect(service.itemDetail).toEqual(MOCK_CAR_ITEM_DETAIL);
    });

    it('should update the item detail observable', () => {
      service.itemDetail$.subscribe((item) => {
        expect(item).toEqual(MOCK_CAR_ITEM_DETAIL);
      });
    });
  });

  describe('when initialize the item...', () => {
    describe('and the petition succed...', () => {
      beforeEach(() => {
        spyOn(itemDetailService, 'getItemDetail').and.returnValue(of(MOCK_ITEM_DETAIL_RESPONSE));
        spyOn(itemDetailFlagsStoreService, 'updateStatusFlag');
        spyOn(itemDetailFlagsStoreService, 'updateBumpedFlag');
        spyOn(mapItemDetailStoreService, 'mapItemDetailStore').and.returnValue(MOCK_CAR_ITEM_DETAIL);

        service.initializeItemAndFlags('2');
      });

      it('should set the itemDetail ', () => {
        expect(mapItemDetailStoreService.mapItemDetailStore).toHaveBeenCalledWith(MOCK_ITEM_DETAIL_RESPONSE);
        expect(service.itemDetail).toBe(MOCK_CAR_ITEM_DETAIL);
      });

      it('should update the status and bumped flag', () => {
        expect(itemDetailFlagsStoreService.updateStatusFlag).toHaveBeenCalledWith(MOCK_ITEM_DETAIL_RESPONSE.item.flags);
        expect(itemDetailFlagsStoreService.updateBumpedFlag).toHaveBeenCalledWith(MOCK_ITEM_DETAIL_RESPONSE.item.bumpFlags);
      });
    });

    describe('and the petition fails...', () => {
      it('should redirect to the not found page', () => {
        const NOT_FOUND_PATH = `/${APP_PATHS.NOT_FOUND}`;
        spyOn(itemDetailService, 'getItemDetail').and.returnValue(throwError('network error'));
        spyOn(router, 'navigate');

        service.initializeItemAndFlags('2');

        expect(router.navigate).toHaveBeenCalledWith([NOT_FOUND_PATH]);
        expect(service.itemDetail).toBe(null);
      });
    });
  });

  describe('when reserving the item...', () => {
    beforeEach(() => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;
      service.itemDetail.item.reserved = false;
    });

    describe('and the request succed...', () => {
      it('should set the item as reserved', () => {
        spyOn(itemDetailService, 'reserveItem').and.returnValue(of());

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.reserved).toBe(true);
        });
      });
    });

    describe('and the request fails...', () => {
      it('should NOT set the item as reserved', () => {
        spyOn(itemDetailService, 'reserveItem').and.returnValue(throwError('network error'));

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.reserved).toBe(false);
        });
      });
    });
  });

  describe('when unreserving the item...', () => {
    beforeEach(() => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;
      service.itemDetail.item.reserved = true;
    });

    describe('and the request succed...', () => {
      it('should set the item as unreserved', () => {
        spyOn(itemDetailService, 'reserveItem').and.returnValue(of());

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.reserved).toBe(false);
        });
      });
    });

    describe('and the request fails...', () => {
      it('should NOT set the item as unreserved', () => {
        spyOn(itemDetailService, 'reserveItem').and.returnValue(throwError('network error'));

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.reserved).toBe(true);
        });
      });
    });
  });

  describe('when we favourite the item...', () => {
    beforeEach(() => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;
      service.itemDetail.item.flags.favorite = false;
    });

    describe('and the request succed...', () => {
      it('should set the item as favourite', () => {
        spyOn(itemDetailService, 'markAsFavourite').and.returnValue(of());

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.flags.favorite).toBe(true);
        });
      });
    });

    describe('and the request fails...', () => {
      it('should NOT set the item as favourite', () => {
        spyOn(itemDetailService, 'markAsFavourite').and.returnValue(throwError('network error'));

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.flags.favorite).toBe(false);
        });
      });
    });
  });

  describe('when we unfavourite the item...', () => {
    beforeEach(() => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;
      service.itemDetail.item.flags.favorite = true;
    });

    describe('and the request succed...', () => {
      it('should set the item as unfavourite', () => {
        spyOn(itemDetailService, 'unmarkAsFavourite').and.returnValue(of());

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.flags.favorite).toBe(false);
        });
      });
    });

    describe('and the request fails...', () => {
      it('should NOT set the item as unfavourite', () => {
        spyOn(itemDetailService, 'unmarkAsFavourite').and.returnValue(throwError('network error'));

        service.toggleReservedItem().subscribe(() => {
          expect(service.itemDetail.item.flags.favorite).toBe(true);
        });
      });
    });
  });

  describe('when selling the item...', () => {
    it('should set the item as sold', () => {
      service.itemDetail = MOCK_CAR_ITEM_DETAIL;

      service.markItemAsSold();

      expect(service.itemDetail.item.sold).toBe(true);
    });
  });
});
