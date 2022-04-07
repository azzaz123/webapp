import { TestBed } from '@angular/core/testing';

import { EnableDeliveryGuard } from './enable-delivery.guard';

describe('EnableDeliveryGuard', () => {
  let guard: EnableDeliveryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EnableDeliveryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
