import { TestBed } from '@angular/core/testing';

import { SearchLocationGuard } from './search-location.guard';

describe('SearchLocationGuard', () => {
  let guard: SearchLocationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SearchLocationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
