import { TestBed } from '@angular/core/testing';

import { MapSpecificationsService } from './map-specifications.service';

describe('MapSpecificationsService', () => {
  let service: MapSpecificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSpecificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
