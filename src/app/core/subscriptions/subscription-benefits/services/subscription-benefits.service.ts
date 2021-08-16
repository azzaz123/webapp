import { Injectable } from '@angular/core';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { subscriptionBenefits } from '../constants/subscription-benefits';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

export const GENERIC_BENEFITS: string[] = [
  $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
  $localize`:@@web_subscription_benefit_title_time:Save management time`,
  $localize`:@@web_subscription_benefit_title_share:Share your phone and website`,
];

@Injectable()
export class SubscriptionBenefitsService {
  private subscriptionBenefits: SubscriptionBenefit[];

  constructor() {}

  public getSubscriptionBenefits(useCache = true): Observable<SubscriptionBenefit[]> {
    if (useCache && this.subscriptionBenefits) {
      return of(this.subscriptionBenefits);
    }
    return of(subscriptionBenefits).pipe(tap((response) => (this.subscriptionBenefits = response)));
  }

  public getBenefitsByCategory(id: number): string[] {
    const customBenefit =
      id !== CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS
        ? $localize`:@@web_subscription_benefit_title_limit:Set your listing limit`
        : $localize`:@@web_subscription_benefit_title_branding:Boost your branding`;
    return [customBenefit, ...GENERIC_BENEFITS];
  }
}
