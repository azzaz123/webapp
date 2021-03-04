import { TestBed } from '@angular/core/testing';

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
});
