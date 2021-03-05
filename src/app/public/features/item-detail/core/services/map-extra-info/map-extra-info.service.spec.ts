import { TestBed } from '@angular/core/testing';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_ITEM_CELLPHONES, MOCK_ITEM_FASHION } from '@fixtures/item.fixtures.spec';
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
});
