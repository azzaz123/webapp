import { TestBed } from '@angular/core/testing';

import { CanDeactivateSearchGuard } from './can-deactivate-search.guard';

describe('CanDeactivateSearchGuard', () => {
  let guard: CanDeactivateSearchGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateSearchGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
