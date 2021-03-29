import { TestBed } from '@angular/core/testing';

import { MapRouteParamsService } from './map-route-params.service';

describe('MapRouteParamsService', () => {
  let service: MapRouteParamsService;
  const userName = 'user-generic-';
  const UUID = '83ghdus823';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapRouteParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the UUID from the web slug...', () => {
    describe('if the UUID is defined...', () => {
      it('should return the UUID', () => {
        const webSlug = userName + UUID;

        expect(service.getUUID(webSlug)).toBe(UUID);
      });
    });
    describe('if the UUID is NOT defined...', () => {
      it('should return the web slug', () => {
        expect(service.getUUID(userName)).toBe(userName);
      });
    });
  });
});
