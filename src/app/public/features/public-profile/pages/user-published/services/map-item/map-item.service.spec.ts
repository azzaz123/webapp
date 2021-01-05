import { TestBed } from '@angular/core/testing';
import { Item } from '@core/item/item';
import { ItemResponse } from '@core/item/item-response.interface';
import { CAR_DATA, MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { ITEM_DATA_V3 } from '@fixtures/item.fixtures.spec';
import {
  MOCK_REALESTATE,
  REALESTATE_DATA,
} from '@fixtures/realestate.fixtures.spec';
import { MapItemService } from './map-item.service';

describe('MapItemService', () => {
  let mapItemService: MapItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapItemService],
    });
    mapItemService = TestBed.inject(MapItemService);
  });

  it('should be created', () => {
    expect(mapItemService).toBeTruthy();
  });

  describe('When asking for items map', () => {
    it('should return correctly mapped list default item', () => {
      const items: Item[] = mapItemService.mapItems([ITEM_DATA_V3]);

      expect(items[0] instanceof Item).toBeTruthy();
    });

    it('should return correctly mapped car item', () => {
      const items: Item[] = mapItemService.mapItems([
        (CAR_DATA as any) as ItemResponse,
      ]);

      expect(items[0] instanceof Item).toBeTruthy();
      expect(items[0]).toEqual(MOCK_CAR);
    });

    it('should return correctly mapped real estate item', () => {
      const items: Item[] = mapItemService.mapItems([
        (REALESTATE_DATA as any) as ItemResponse,
      ]);

      expect(items[0] instanceof Item).toBeTruthy();
      expect(items[0]).toEqual(MOCK_REALESTATE);
    });
  });
});
