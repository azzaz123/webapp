import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_RECOMMENDED_ITEM_CARD, MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES } from '@fixtures/item-card.fixtures.spec';
import {
  RECOMMENDED_ITEM_MOCK,
  RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { MapRecommendedItemCardService } from './map-recommended-item-card.service';

describe('MapRecommendedItemCardService', () => {
  let service: MapRecommendedItemCardService;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapRecommendedItemCardService);
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValue('1213');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {
      expect(service.mapRecommendedItems([RECOMMENDED_ITEM_MOCK, RECOMMENDED_ITEM_MOCK])).toStrictEqual([
        MOCK_RECOMMENDED_ITEM_CARD,
        MOCK_RECOMMENDED_ITEM_CARD,
      ]);
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the image as null', () => {
        expect(service.mapRecommendedItems([RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES])).toStrictEqual([
          MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES,
        ]);
      });
    });
  });
});
