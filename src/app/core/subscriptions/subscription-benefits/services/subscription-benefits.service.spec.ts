import { TestBed } from '@angular/core/testing';
import { subscriptionBenefits } from '../constants/subscription-benefits';

import { SubscriptionBenefitsService } from './subscription-benefits.service';

describe('SubscriptionBenefitsService', () => {
  let service: SubscriptionBenefitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionBenefitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for all the subscription benefits', () => {
    it('should get all subscription benefits', () => {
      let result;

      service.getSubscriptionBenefits().subscribe((response) => (result = response));

      expect(result).toEqual(subscriptionBenefits);
    });
  });
});
