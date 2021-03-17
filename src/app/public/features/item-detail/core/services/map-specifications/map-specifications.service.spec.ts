import { TestBed } from '@angular/core/testing';
import { MOCK_ITEM_GAMES_CONSOLES } from '@fixtures/item.fixtures.spec';
import {
  MOCK_COUNTER_SPECIFICATIONS_CAR,
  MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE,
  MOCK_MAP_SPECIFICATIONS_CAR,
  MOCK_MAP_SPECIFICATIONS_CAR_BODY_OTHERS,
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

  describe('when the item is not a car or a real estate...', () => {
    it('should not return any specification', () => {
      expect(service.mapSpecification(MOCK_ITEM_GAMES_CONSOLES)).toEqual(undefined);
    });
  });

  describe('when the item is a car or a real estate...', () => {
    describe('when we map the car specifications...', () => {
      it('should return their counter specifications', () => {
        expect(service.mapSpecification(MOCK_MAP_SPECIFICATIONS_CAR)).toStrictEqual(MOCK_COUNTER_SPECIFICATIONS_CAR);
      });

      describe('and the body type is others...', () => {
        it('should not return the body type as specification', () => {
          const CAR_SPECIFICATIONS = MOCK_COUNTER_SPECIFICATIONS_CAR;
          CAR_SPECIFICATIONS.shift();

          expect(service.mapSpecification(MOCK_MAP_SPECIFICATIONS_CAR_BODY_OTHERS)).toStrictEqual(CAR_SPECIFICATIONS);
        });
      });
    });

    describe('when we map the realestate specifications...', () => {
      it('should return their counter specifications', () => {
        expect(service.mapSpecification(MOCK_MAP_SPECIFICATIONS_REAL_ESTATE)).toStrictEqual(MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE);
      });
    });
  });
});
