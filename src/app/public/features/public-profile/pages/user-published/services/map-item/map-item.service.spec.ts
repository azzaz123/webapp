import { TestBed } from '@angular/core/testing';
import { Item } from '@core/item/item';
import { UuidService } from '@core/uuid/uuid.service';
import { CAR_DATA, MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { ITEM_DATA_V3 } from '@fixtures/item.fixtures.spec';
import { MOCK_REALESTATE, REALESTATE_DATA } from '@fixtures/realestate.fixtures.spec';
import {
  MAPPED_RECOMMENDED_ITEM_MOCK,
  RECOMMENDED_ITEMS_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { MapItemService } from './map-item.service';

describe('MapItemService', () => {
  let mapItemService: MapItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapItemService,
        {
          provide: UuidService,
          useValue: {
            getUUID: () => {
              return '2';
            },
          },
        },
      ],
    });
    mapItemService = TestBed.inject(MapItemService);
  });

  it('should be created', () => {
    expect(mapItemService).toBeTruthy();
  });

  describe('When asking for items map', () => {
    it('should return correctly mapped list default item', () => {
      (ITEM_DATA_V3.content.user as any) = {
        id: ITEM_DATA_V3.content.seller_id,
      };

      const items: Item[] = mapItemService.mapItems([ITEM_DATA_V3]);

      expect(items[0] instanceof Item).toBeTruthy();
    });

    it('should return correctly mapped car item', () => {
      const CAR = CAR_DATA as any;
      CAR.content = {
        ...CAR_DATA.content,
        user: { id: CAR_DATA.content.seller_id },
      };

      const items: Item[] = mapItemService.mapItems([CAR]);

      expect(items[0] instanceof Item).toBeTruthy();
      expect(items[0]).toEqual(MOCK_CAR);
    });

    it('should return correctly mapped real estate item', () => {
      const REALESTATE = REALESTATE_DATA as any;
      REALESTATE.content = {
        ...REALESTATE_DATA.content,
        user: { id: REALESTATE_DATA.content.seller_id },
      };

      const items: Item[] = mapItemService.mapItems([REALESTATE]);

      expect(items[0] instanceof Item).toBeTruthy();
      expect(items[0]).toEqual(MOCK_REALESTATE);
    });
  });

  describe('When asking for one item map', () => {
    it('should return correctly mapped list default item', () => {
      (ITEM_DATA_V3.content.user as any) = {
        id: ITEM_DATA_V3.content.seller_id,
      };

      const item: Item = mapItemService.mapItem(ITEM_DATA_V3);

      expect(item instanceof Item).toBeTruthy();
    });

    it('should return correctly mapped car item', () => {
      const CAR = CAR_DATA as any;
      CAR.content = {
        ...CAR_DATA.content,
        user: { id: CAR_DATA.content.seller_id },
      };

      const item: Item = mapItemService.mapItem(CAR);

      expect(item instanceof Item).toBeTruthy();
      expect(item).toEqual(MOCK_CAR);
    });

    it('should return correctly mapped real estate item', () => {
      const REALESTATE = REALESTATE_DATA as any;
      REALESTATE.content = {
        ...REALESTATE_DATA.content,
        user: { id: REALESTATE_DATA.content.seller_id },
      };

      const item: Item = mapItemService.mapItem(REALESTATE);

      expect(item instanceof Item).toBeTruthy();
      expect(item).toEqual(MOCK_REALESTATE);
    });
  });

  describe('when asking for map recommended items', () => {
    it('should return correctly mapped items', () => {
      const items: Item[] = mapItemService.mapRecommendedItem(RECOMMENDED_ITEMS_MOCK);

      items.forEach((item) => {
        expect(item instanceof Item).toBeTruthy();
        expect(item).toEqual(MAPPED_RECOMMENDED_ITEM_MOCK);
      });
    });
  });
});
