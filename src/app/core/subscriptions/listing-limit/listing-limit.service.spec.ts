import { TestBed } from '@angular/core/testing';

import { ListingLimitService } from './listing-limit.service';

describe('ListingLimitService', () => {
  let service: ListingLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
