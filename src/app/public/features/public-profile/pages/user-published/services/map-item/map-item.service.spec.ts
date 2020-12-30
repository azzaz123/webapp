import { TestBed } from '@angular/core/testing';
import { Item } from '@core/item/item';
import { ITEM_DATA_V3 } from '@fixtures/item.fixtures.spec';
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
    it('should return correctly mapped list', () => {
      const items: Item[] = mapItemService.mapItems([ITEM_DATA_V3]);

      expect(items[0] instanceof Item).toBeTruthy();
    });
  });
});
