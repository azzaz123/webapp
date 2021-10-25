import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES, Tier } from '../../../../core/subscriptions/subscriptions.interface';
import { map, take } from 'rxjs/operators';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { AnalyticsPageView, ViewProSubscriptionPopup, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from 'app/core/analytics/analytics-constants';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';

export const CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE = [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE, CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS];

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss'],
})
export class TooManyItemsModalComponent implements OnInit {
  public type = SUBSCRIPTION_TYPES.notSubscribed;
  public notSubscribedType = SUBSCRIPTION_TYPES.notSubscribed;
  public carDealerType = SUBSCRIPTION_TYPES.carDealer;
  public stripeType = SUBSCRIPTION_TYPES.stripe;
  public isFreeTrial: boolean;
  public tierDicounted: Tier;
  public isHighestLimit: boolean;
  public categorySubscription: SubscriptionsResponse;
  @Input() itemId: string;

  public categoryName: string;
  public categoryIconName: string;
  public readonly PRO_PATHS = PRO_PATHS;

  private isHighestLimitConfig: { [key: string]: { zendesk: CUSTOMER_HELP_PAGE; descriptionText: TRANSLATION_KEY } } = {
    [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE]: {
      zendesk: CUSTOMER_HELP_PAGE.PROS_REAL_ESTATE_SUBSCRIPTION,
      descriptionText: TRANSLATION_KEY.REAL_ESTATE_HIGHEST_LIMIT_REACHED_DESCRIPTION,
    },
    [CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS]: {
      zendesk: CUSTOMER_HELP_PAGE.PROS_CONSUMER_GOODS_SUBSCRIPTION,
      descriptionText: TRANSLATION_KEY.CONSUMER_GOODS_HIGHEST_LIMIT_REACHED_DESCRIPTION,
    },
  };

  constructor(
    public activeModal: NgbActiveModal,
    private itemService: ItemService,
    private subscriptionsService: SubscriptionsService,
    private analyticsService: AnalyticsService,
    private translateService: I18nService,
    private customerHelpService: CustomerHelpService
  ) {}

  ngOnInit() {
    this.getSubscriptionInfo(this.itemId)
      .pipe(take(1))
      .subscribe(() => {
        this.trackPageView();
      });
  }

  private trackPageView(): void {
    const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
      attributes: {
        screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
        subscription: this.categorySubscription.category_id as SUBSCRIPTION_CATEGORIES,
        freeTrial: this.isFreeTrial,
        isCarDealer: this.type === this.carDealerType,
        discount: !!this.tierDicounted,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private getSubscriptionInfo(itemId: string): Observable<void> {
    return forkJoin([this.itemService.get(itemId), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => {
        const item = values[0];
        const subscriptions = values[1];
        this.categorySubscription = this.subscriptionsService.getSubscriptionByCategory(subscriptions, item.categoryId);
        this.isHighestLimit = this.hasHighestLimitReached();
        this.isFreeTrial = this.subscriptionsService.hasFreeTrialByCategoryId(subscriptions, item.categoryId);
        this.tierDicounted = this.subscriptionsService.tierDiscountByCategoryId(subscriptions, item.categoryId);
      })
    );
  }

  private hasHighestLimitReached(): boolean {
    return (
      this.subscriptionsService.hasHighestLimit(this.categorySubscription) &&
      CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE.includes(this.categorySubscription.category_id)
    );
  }

  get highestLimitText(): string {
    return this.translateService.translate(this.isHighestLimitConfig[this.categorySubscription.category_id].descriptionText);
  }

  get zenDeskUrl(): string {
    return this.customerHelpService.getPageUrl(this.isHighestLimitConfig[this.categorySubscription.category_id].zendesk);
  }
}
