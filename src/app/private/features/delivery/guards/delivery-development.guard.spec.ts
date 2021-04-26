import { TestBed } from '@angular/core/testing';

import { DeliveryDevelopmentGuard } from './delivery-development.guard';

describe('DeliveryDevelopmentGuard', () => {
  let guard: DeliveryDevelopmentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeliveryDevelopmentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
