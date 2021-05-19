import { TestBed } from '@angular/core/testing';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import {
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_FASHION,
  MOCK_ITEM_GAMES_CONSOLES,
  MOCK_ITEM_FASHION_WITHOUT_EXTRA_INFO,
  MOCK_ITEM_CELLPHONES_WITHOUT_EXTRA_INFO,
} from '@fixtures/item.fixtures.spec';
import { MOCK_CAR_EXTRA_INFO, MOCK_CELLPHONE_EXTRA_INFO, MOCK_FASHION_EXTRA_INFO } from './map-extra-info.fixtures.spec';

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

  describe('when the item is not a car or a phone or a fashion item...', () => {
    it('should return nothing', () => {
      expect(service.mapExtraInfo(MOCK_ITEM_GAMES_CONSOLES)).toEqual([]);
    });
  });

  describe('when the item is a car or a phone or a fashion item...', () => {
    describe('when mapping phone specifications...', () => {
      it('should return their formatted specifications', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_CELLPHONES)).toEqual(MOCK_CELLPHONE_EXTRA_INFO);
      });
    });

    describe('when mapping fashion item specifications...', () => {
      it('should return their formatted specifications', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_FASHION)).toEqual(MOCK_FASHION_EXTRA_INFO);
      });
    });

    describe('when mapping car specifications...', () => {
      it('should return their formatted specifications', () => {
        expect(service.mapExtraInfo(MOCK_CAR)).toEqual(MOCK_CAR_EXTRA_INFO);
      });
    });

    describe('and when item does not have extra info and is not a car', () => {
      it('should return nothing', () => {
        expect(service.mapExtraInfo(MOCK_ITEM_FASHION_WITHOUT_EXTRA_INFO)).toEqual([]);
        expect(service.mapExtraInfo(MOCK_ITEM_CELLPHONES_WITHOUT_EXTRA_INFO)).toEqual([]);
      });
    });
  });
});
