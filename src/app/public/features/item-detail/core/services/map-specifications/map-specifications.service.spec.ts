import { TestBed } from '@angular/core/testing';
import {
  MOCK_COUNTER_SPECIFICATIONS_CAR,
  MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE,
  MOCK_MAP_SPECIFICATIONS_CAR,
  MOCK_MAP_SPECIFICATIONS_REAL_ESTATE,
} from '@fixtures/map-specifications.fixtures.spec';

import { MapSpecificationsService } from './map-specifications.service';

describe('MapSpecificationsService', () => {
  let service: MapSpecificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapSpecificationsService],
    });
    service = TestBed.inject(MapSpecificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map the car specifications...', () => {
    it('should return their counter specifications', () => {
      expect(service.mapCarSpecifications(MOCK_MAP_SPECIFICATIONS_CAR)).toStrictEqual(MOCK_COUNTER_SPECIFICATIONS_CAR);
    });
  });

  describe('when we map the realestate specifications...', () => {
    it('should return their counter specifications', () => {
      expect(service.mapRealestateSpecifications(MOCK_MAP_SPECIFICATIONS_REAL_ESTATE)).toStrictEqual(
        MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE
      );
    });
  });
});
