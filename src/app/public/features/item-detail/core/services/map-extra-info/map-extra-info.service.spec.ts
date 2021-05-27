import { TestBed } from '@angular/core/testing';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import {
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CELLPHONES_WITHOUT_EXTRA_INFO,
  MOCK_ITEM_FASHION,
  MOCK_ITEM_FASHION_WITHOUT_EXTRA_INFO,
  MOCK_ITEM_GAMES_CONSOLES,
  MOCK_ITEM_GAMES_CONSOLES_WITH_EXTRA_INFO,
} from '@fixtures/item.fixtures.spec';
import {
  MOCK_CAR_EXTRA_INFO_LABELS,
  MOCK_CELLPHONE_EXTRA_INFO_LABELS,
  MOCK_FASHION_EXTRA_INFO_LABELS,
  MOCK_ITEM_GAMES_CONSOLES_EXTRA_INFO_LABELS,
} from './map-extra-info.fixtures.spec';

import { MapExtraInfoService } from './map-extra-info.service';

describe('MapExtraInfoService', () => {
  let service: MapExtraInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapExtraInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the item does not have extra info', () => {
    it('should return nothing', () => {
      expect(service.mapExtraInfo(MOCK_ITEM_GAMES_CONSOLES)).toEqual([]);
      expect(service.mapExtraInfo(MOCK_ITEM_FASHION_WITHOUT_EXTRA_INFO)).toEqual([]);
      expect(service.mapExtraInfo(MOCK_ITEM_CELLPHONES_WITHOUT_EXTRA_INFO)).toEqual([]);
    });
  });

  describe('when the item has extra info', () => {
    describe('and when the item is a cellphone item ', () => {
      it('should return formatted extra info', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_CELLPHONES)).toEqual(MOCK_CELLPHONE_EXTRA_INFO_LABELS);
      });
    });

    describe('and when the item is a fashion item', () => {
      it('should return formatted extra info', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_FASHION)).toEqual(MOCK_FASHION_EXTRA_INFO_LABELS);
      });
    });

    describe('and when the item is a car item', () => {
      it('should return formatted extra info', () => {
        expect(service.mapExtraInfo(MOCK_CAR)).toEqual(MOCK_CAR_EXTRA_INFO_LABELS);
      });
    });

    describe('and when the item is another kind of item', () => {
      it('should return formatted extra info', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_GAMES_CONSOLES_WITH_EXTRA_INFO)).toEqual(MOCK_ITEM_GAMES_CONSOLES_EXTRA_INFO_LABELS);
      });
    });
  });
});
