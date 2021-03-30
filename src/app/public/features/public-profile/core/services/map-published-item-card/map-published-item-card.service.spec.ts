import { TestBed } from '@angular/core/testing';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_PUBLISHED_ITEM_CARD, MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES } from '@fixtures/item-card.fixtures.spec';
import { ITEM_DATA_V3 } from '@fixtures/item.fixtures.spec';
import { MapPublishedItemCardService } from './map-published-item-card.service';

describe('MapPublishedItemCardService', () => {
  let service: MapPublishedItemCardService;
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPublishedItemCardService);
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValue('1213');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {
      expect(service.mapPublishedItems([ITEM_DATA_V3, ITEM_DATA_V3])).toStrictEqual([MOCK_PUBLISHED_ITEM_CARD, MOCK_PUBLISHED_ITEM_CARD]);
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the content image as main image', () => {
        const ITEM_DATA_V3_WITHOUT_IMAGE = ITEM_DATA_V3;
        ITEM_DATA_V3_WITHOUT_IMAGE.content.images = [];

        expect(service.mapPublishedItems([ITEM_DATA_V3_WITHOUT_IMAGE, ITEM_DATA_V3_WITHOUT_IMAGE])).toStrictEqual([
          MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES,
          MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES,
        ]);
      });
    });
  });
});
