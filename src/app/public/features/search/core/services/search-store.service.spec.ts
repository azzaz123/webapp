import { TestBed } from '@angular/core/testing';

import { SearchStoreService } from './search-store.service';
import { MOCK_SEARCH_ITEM } from './search-store.service.fixtures';

describe('SearchStoreService', () => {
  let service: SearchStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchStoreService],
    });
    service = TestBed.inject(SearchStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when value asked directly', () => {
    beforeEach(() => {
      service.setItems([MOCK_SEARCH_ITEM]);
    });
    it('should return current item list', () => {
      expect(service.getItems()).toEqual([MOCK_SEARCH_ITEM]);
    });
  });

  describe('when items are set', () => {
    beforeEach(() => {
      service.setItems([]);
    });
    it('should overwrite previous content with new one', () => {
      const items = [MOCK_SEARCH_ITEM];
      service.setItems(items);

      expect(service.getItems()).toEqual(items);
    });

    it('should propagate the items to listeners', () => {
      const callback = jest.fn();
      service.items$.subscribe(callback);

      const items = [MOCK_SEARCH_ITEM];
      service.setItems(items);

      expect(callback).toHaveBeenCalledWith(items);
    });
  });

  describe('when items are appended', () => {
    const otherItem = {
      ...MOCK_SEARCH_ITEM,
      id: 'my-other-id',
    };
    beforeEach(() => {
      service.setItems([otherItem]);
    });
    it('should add items at the end of the list', () => {
      const items = [MOCK_SEARCH_ITEM];
      service.appendItems(items);

      expect(service.getItems()).toEqual([otherItem, ...items]);
    });

    it('should propagate the items to listeners', () => {
      const callback = jest.fn();
      service.items$.subscribe(callback);

      const items = [MOCK_SEARCH_ITEM];
      service.appendItems(items);

      expect(callback).toHaveBeenCalledWith([otherItem, ...items]);
    });
  });

  describe('when item count is queried', () => {
    beforeEach(() => {
      service.setItems([MOCK_SEARCH_ITEM, MOCK_SEARCH_ITEM, MOCK_SEARCH_ITEM]);
    });
    it('should return item count', () => {
      expect(service.getItemCount()).toBe(3);
    });
  });
});
