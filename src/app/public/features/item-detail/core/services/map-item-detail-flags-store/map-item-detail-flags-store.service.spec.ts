import { TestBed } from '@angular/core/testing';
import {
  MOCK_ITEM_FLAGS,
  MOCK_ITEM_FLAGS_EXPIRED,
  MOCK_ITEM_FLAGS_INACTIVE,
  MOCK_ITEM_FLAGS_RESERVED,
  MOCK_ITEM_FLAGS_SOLD,
  MOCK_ITEM_VISIBILITY_FLAGS,
  MOCK_ITEM_VISIBILITY_FLAGS_BUMPED,
  MOCK_ITEM_VISIBILITY_FLAGS_COUNTRY_BUMPED,
} from '@fixtures/item-detail-flags.fixtures.spec';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag-constants';
import { MapItemDetailFlagsStoreService } from './map-item-detail-flags-store.service';

describe('MapItemDetailFlagsStoreService', () => {
  let service: MapItemDetailFlagsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MapItemDetailFlagsStoreService],
    });
    service = TestBed.inject(MapItemDetailFlagsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we handle the bumped flag...', () => {
    describe('and is bumped...', () => {
      it('should return the bumped flag', () => {
        expect(service.mapBumpedFlag(MOCK_ITEM_VISIBILITY_FLAGS_BUMPED)).toBe(BUMPED_ITEM_FLAG_TYPES.BUMPED);
      });
    });

    describe('and is country bumped...', () => {
      it('should return the country bumped flag', () => {
        expect(service.mapBumpedFlag(MOCK_ITEM_VISIBILITY_FLAGS_COUNTRY_BUMPED)).toBe(BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP);
      });
    });

    describe('and is NOT bumped...', () => {
      it('should NOT return any flag', () => {
        expect(service.mapBumpedFlag(MOCK_ITEM_VISIBILITY_FLAGS)).toBe(undefined);
      });
    });
  });

  describe('when we handle the status flag...', () => {
    describe('and is sold...', () => {
      it('should return the sold flag', () => {
        expect(service.mapStatusFlag(MOCK_ITEM_FLAGS_SOLD)).toBe(STATUS_ITEM_FLAG_TYPES.SOLD);
      });
    });

    describe('and is reserved...', () => {
      it('should return the reserved flag', () => {
        expect(service.mapStatusFlag(MOCK_ITEM_FLAGS_RESERVED)).toBe(STATUS_ITEM_FLAG_TYPES.RESERVED);
      });
    });

    describe('and is expired...', () => {
      it('should return the expired flag', () => {
        expect(service.mapStatusFlag(MOCK_ITEM_FLAGS_EXPIRED)).toBe(STATUS_ITEM_FLAG_TYPES.EXPIRED);
      });
    });

    describe('and is inactive...', () => {
      it('should return the inactive flag', () => {
        expect(service.mapStatusFlag(MOCK_ITEM_FLAGS_INACTIVE)).toBe(STATUS_ITEM_FLAG_TYPES.INACTIVE);
      });
    });

    describe('and is NOT sold, reserved, expired or inactive...', () => {
      it('should NOT return any flag', () => {
        expect(service.mapStatusFlag(MOCK_ITEM_FLAGS)).toBe(undefined);
      });
    });
  });
});
