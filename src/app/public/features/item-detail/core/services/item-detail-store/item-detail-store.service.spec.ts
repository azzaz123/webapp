import { TestBed } from '@angular/core/testing';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';

import { ItemDetailStoreService } from './item-detail-store.service';

describe('ItemDetailStoreService', () => {
  let service: ItemDetailStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemDetailStoreService],
    });
    service = TestBed.inject(ItemDetailStoreService);
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

  describe('when setting the user...', () => {
    it('should update the value', () => {
      service.user = MOCK_USER;
      expect(service.user).toEqual(MOCK_USER);
      service.user$.subscribe((user) => {
        expect(user).toEqual(MOCK_USER);
      });
    });
  });
});
