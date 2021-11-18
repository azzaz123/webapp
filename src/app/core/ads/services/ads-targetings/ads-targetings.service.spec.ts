import { TestBed } from '@angular/core/testing';

import { AdsTargetingsService } from './ads-targetings.service';

describe('AdsTargetingsService', () => {
  let service: AdsTargetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsTargetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
