import { TestBed } from '@angular/core/testing';

import { ManageSubscriptionService } from './manage-subscription.service';

describe('ManageSubscriptionService', () => {
  let service: ManageSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
