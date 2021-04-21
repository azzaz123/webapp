import { TestBed } from '@angular/core/testing';
import { subscriptionBenefits } from '../constants/subscription-benefits';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

import { SubscriptionBenefitsService } from './subscription-benefits.service';

describe('SubscriptionBenefitsService', () => {
  let service: SubscriptionBenefitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionBenefitsService],
    });
    service = TestBed.inject(SubscriptionBenefitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for all the subscription benefits', () => {
    it('should get all subscription benefits', () => {
      let result: SubscriptionBenefit[];

      service.getSubscriptionBenefits().subscribe((response) => (result = response));

      expect(result).toEqual(subscriptionBenefits);
    });
  });
});