import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';

export class MockSubscriptionBenefitsService {
  public getBenefitsByCategory(id: number): string[] {
    return [];
  }

  public getSubscriptionsHeaderBenefits(): Observable<SubscriptionBenefit[]> {
    return of([]);
  }

  get showHeaderBenefits$() {
    return of(true);
  }
}

export const subscriptionBenefitsMapped: SubscriptionBenefit[] = [
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-1.png',
    title: $localize`:@@web_subscription_benefit_title_your_brand:Empower your brand`,
    description: $localize`:@@web_subscription_benefit_description_your_brand:Complete your profile with a cover photo and a description.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-2.png',
    title: $localize`:@@web_subscription_benefit_title_connect:Connect with more customers`,
    description: $localize`:@@web_subscription_benefit_description_connect:Share your phone number and website with millions of people.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-3.png',
    title: $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
    description: $localize`:@@web_subscription_benefit_description_visibility:Appear at the top of search results and attract more customers.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-4.png',
    title: $localize`:@@web_subscription_benefit_title_time:Save management time`,
    description: $localize`:@@web_subscription_benefit_description_time:Your products will always be active and ready for sale.`,
  },
];

export const mockBenefits: SubscriptionBenefit[] = [
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-1.png',
    title: $localize`:@@web_subscription_benefit_title_your_brand:Empower your brand`,
    description: $localize`:@@web_subscription_benefit_description_your_brand:Complete your profile with a cover photo and a description.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-2.png',
    title: $localize`:@@web_subscription_benefit_title_connect:Connect with more customers`,
    description: $localize`:@@web_subscription_benefit_description_connect:Share your phone number and website with millions of people.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-3.png',
    title: $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
    description: $localize`:@@web_subscription_benefit_description_visibility:Appear at the top of search results and attract more customers.`,
  },
  {
    iconPath: 'assets/images/subscriptions/benefits/en/img-4.png',
    title: $localize`:@@web_subscription_benefit_title_time:Save management time`,
    description: $localize`:@@web_subscription_benefit_description_time:Your products will always be active and ready for sale.`,
  },
];
