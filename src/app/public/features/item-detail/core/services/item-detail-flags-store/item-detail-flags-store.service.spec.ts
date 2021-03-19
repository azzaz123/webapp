import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_ITEM_FLAGS_RESERVED, MOCK_ITEM_VISIBILITY_FLAGS_BUMPED } from '@fixtures/item-detail-flags.fixtures.spec';
import {
  BUMPED_ITEM_FLAG_TYPES,
  EMPTY_ITEM_FLAGS,
  EMPTY_ITEM_VISIBILITY_FLAGS,
  STATUS_ITEM_FLAG_TYPES,
} from '@public/shared/components/item-flag/item-flag-constants';
import { MapItemDetailFlagsStoreService } from '../map-item-detail-flags-store/map-item-detail-flags-store.service';
import { ItemDetailFlagsStoreService } from './item-detail-flags-store.service';

describe('ItemDetailFlagsStoreService', () => {
  let service: ItemDetailFlagsStoreService;
  let mapItemDetailFlagsStoreService: MapItemDetailFlagsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemDetailFlagsStoreService,
        {
          provide: MapItemDetailFlagsStoreService,
          useValue: {
            mapStatusFlag: () => {
              return EMPTY_ITEM_FLAGS;
            },
            mapBumpedFlag: () => {
              return EMPTY_ITEM_VISIBILITY_FLAGS;
            },
          },
        },
      ],
    });

    service = TestBed.inject(ItemDetailFlagsStoreService);
    mapItemDetailFlagsStoreService = TestBed.inject(MapItemDetailFlagsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when setting the status flag...', () => {
    beforeEach(() => {
      service.statusFlag = STATUS_ITEM_FLAG_TYPES.RESERVED;
    });

    it('should update the status flag', () => {
      expect(service.statusFlag).toEqual(STATUS_ITEM_FLAG_TYPES.RESERVED);
    });

    it('should update the status flag observable', () => {
      service.statusFlag$.subscribe((flag) => {
        expect(flag).toEqual(STATUS_ITEM_FLAG_TYPES.RESERVED);
      });
    });
  });

  describe('when setting the bumped flag...', () => {
    beforeEach(() => {
      service.bumpedFlag = BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP;
    });

    it('should update the status flag', () => {
      expect(service.bumpedFlag).toEqual(BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP);
    });

    it('should update the status flag observable', () => {
      service.bumpedFlag$.subscribe((flag) => {
        expect(flag).toEqual(BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP);
      });
    });
  });

  describe('when refreshing the status flag...', () => {
    it('should set the mapped flag', () => {
      service.updateStatusFlag(MOCK_ITEM_FLAGS_RESERVED);

      expect(service.statusFlag).toStrictEqual(EMPTY_ITEM_FLAGS);
    });
  });

  describe('when refreshing the bumped flag...', () => {
    it('should set the mapped flag', () => {
      service.updateBumpedFlag(MOCK_ITEM_VISIBILITY_FLAGS_BUMPED);

      expect(service.bumpedFlag).toStrictEqual(EMPTY_ITEM_VISIBILITY_FLAGS);
    });
  });
});
