import { TestBed } from '@angular/core/testing';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';

import { ItemStoreService } from './item-store.service';

describe('ItemStoreService', () => {
  let service: ItemStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemStoreService],
    });
    service = TestBed.inject(ItemStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the item...', () => {
    it('should update the value', () => {
      service.item = MOCK_ITEM;
      expect(service.item).toEqual(MOCK_ITEM);
      service.item$.subscribe((item) => {
        expect(item).toEqual(MOCK_ITEM);
      });
    });
  });
});
