import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HelpLocaleId } from '@core/external-links/customer-help/customer-help-constants';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { subscriptionBenefits, subscriptionsHeaderBenefits } from '../constants/subscription-benefits';
import { SubscriptionBenefit } from '../interfaces/subscription-benefit.interface';

export const SUBSCRIPTION_IMAGES_FOLDER = 'assets/images/subscriptions/benefits';
export const GENERIC_BENEFITS: string[] = [
  $localize`:@@web_subscription_benefit_title_visibility:Gain more visibility`,
  $localize`:@@web_subscription_benefit_title_time:Save management time`,
  $localize`:@@web_subscription_benefit_title_share:Share your phone and website`,
];

@Injectable()
export class SubscriptionBenefitsService {
  private subscriptionBenefits: SubscriptionBenefit[];
  public showHeaderBenefits: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(@Inject(LOCALE_ID) private locale: HelpLocaleId) {}

  public get showHeaderBenefits$(): Observable<boolean> {
    return this.showHeaderBenefits.asObservable();
  }

  public getSubscriptionBenefits(useCache = true): Observable<SubscriptionBenefit[]> {
    if (useCache && this.subscriptionBenefits) {
      return of(this.subscriptionBenefits);
    }
    return of(subscriptionBenefits).pipe(
      map((response) => this.mapBenefits(response)),
      tap((benefits) => (this.subscriptionBenefits = this.mapBenefits(benefits)))
    );
  }

  public getSubscriptionsHeaderBenefits(): Observable<SubscriptionBenefit[]> {
    return of(subscriptionsHeaderBenefits);
  }

  private mapBenefits(benefits: SubscriptionBenefit[]): SubscriptionBenefit[] {
    return benefits.map((benefit) => this.mapBenefit(benefit));
  }

  private mapBenefit(benefit: SubscriptionBenefit): SubscriptionBenefit {
    // FIXME to remove this strategy for having translated text in images
    const locale = this.locale !== 'es' ? 'en' : 'es';
    return {
      ...benefit,
      iconPath: `${SUBSCRIPTION_IMAGES_FOLDER}/${locale}/${benefit.iconPath}`,
    };
  }

  public getBenefitsByCategory(id: number): string[] {
    const customBenefit =
      id !== CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS
        ? $localize`:@@web_subscription_benefit_title_limit:Set your listing limit`
        : $localize`:@@web_subscription_benefit_title_branding:Boost your branding`;
    return [customBenefit, ...GENERIC_BENEFITS];
  }
}
