import { TestBed } from '@angular/core/testing';

import { MobileOnlyGuard } from './mobile-only.guard';

describe('MobileOnlyGuard', () => {
  let guard: MobileOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MobileOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
