import { TestBed } from '@angular/core/testing';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { subscriptionBenefitsMapped } from '@fixtures/subscription-benefits.fixture';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

import { GENERIC_BENEFITS, SubscriptionBenefitsService } from './subscription-benefits.service';

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

      expect(result).toEqual(subscriptionBenefitsMapped);
    });
  });

  describe('get benefits list by category', () => {
    describe('is everything else category', () => {
      it('should return benefits', () => {
        const result = service.getBenefitsByCategory(CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS);

        expect(result).toEqual([$localize`:@@web_subscription_benefit_title_branding:Boost your branding`, ...GENERIC_BENEFITS]);
      });
    });

    describe('is not everything else category', () => {
      it('should return benefits', () => {
        const result = service.getBenefitsByCategory(CATEGORY_SUBSCRIPTIONS_IDS.CAR);

        expect(result).toEqual([$localize`:@@web_subscription_benefit_title_limit:Set your listing limit`, ...GENERIC_BENEFITS]);
      });
    });
  });
});
