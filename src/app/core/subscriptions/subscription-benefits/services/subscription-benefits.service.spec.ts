import { TestBed } from '@angular/core/testing';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { subscriptionBenefits } from '../constants/subscription-benefits';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

import { genericBenefits, SubscriptionBenefitsService } from './subscription-benefits.service';

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

  describe('getBenefits', () => {
    describe('is everything else category', () => {
      it('should return benefits', () => {
        const result = service.getBenefitsByCategory(CATEGORY_SUBSCRIPTIONS_IDS.EVERYTHING_ELSE);

        expect(result).toEqual([$localize`:@@web_subscription_benefit_title_branding:Boost your branding`, ...genericBenefits]);
      });
    });

    describe('is not everything else category', () => {
      it('should return benefits', () => {
        const result = service.getBenefitsByCategory(CATEGORY_SUBSCRIPTIONS_IDS.CAR);

        expect(result).toEqual([$localize`:@@web_subscription_benefit_title_limit:Set your listing limit`, ...genericBenefits]);
      });
    });
  });
});
