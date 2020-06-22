import { TestBed } from '@angular/core/testing';

import { TrustAndSafetyService } from './trust-and-safety.service';

describe('TrustAndSafetyService', () => {
  let service: TrustAndSafetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustAndSafetyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
