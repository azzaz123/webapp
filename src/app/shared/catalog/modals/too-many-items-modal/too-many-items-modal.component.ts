import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';

import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, SUBSCRIPTION_CATEGORIES } from '../../../../core/subscriptions/subscriptions.interface';
import { map, take } from 'rxjs/operators';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { AnalyticsPageView, ViewProSubscriptionPopup, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from 'app/core/analytics/analytics-constants';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '@core/subscriptions/category-subscription-ids';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';

export const CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE = [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE];

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss'],
})
export class TooManyItemsModalComponent implements OnInit {
  public type = SUBSCRIPTION_TYPES.notSubscribed;
  public notSubscribedType = SUBSCRIPTION_TYPES.notSubscribed;
  public inAppType = SUBSCRIPTION_TYPES.inApp;
  public carDealerType = SUBSCRIPTION_TYPES.carDealer;
  public stripeType = SUBSCRIPTION_TYPES.stripe;
  public isFreeTrial: boolean;
  private isDiscountAvailable: boolean;
  public isHighestLimit: boolean;
  public categorySubscription: SubscriptionsResponse;
  @Input() itemId: string;

  public categoryName: string;
  public categoryIconName: string;
  public readonly PRO_PATHS = PRO_PATHS;

  private isHighestLimitConfig: { [key: string]: { zendesk: TRANSLATION_KEY; descriptionText: TRANSLATION_KEY } } = {
    [CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE]: {
      zendesk: TRANSLATION_KEY.ZENDESK_REAL_ESTATE_LIMIT_URL,
      descriptionText: TRANSLATION_KEY.REAL_ESTATE_HIGHEST_LIMIT_REACHED_DESCRIPTION,
    },
  };

  constructor(
    public activeModal: NgbActiveModal,
    private itemService: ItemService,
    private subscriptionsService: SubscriptionsService,
    private analyticsService: AnalyticsService,
    private translateService: I18nService
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
        discount: this.isDiscountAvailable,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private getSubscriptionInfo(itemId: string): Observable<void> {
    return forkJoin([this.itemService.get(itemId), this.subscriptionsService.getSubscriptions(false)]).pipe(
      map((values) => {
        const item = values[0];
        const subscriptions = values[1];
        this.categorySubscription = subscriptions.find((subscription) => item.categoryId === subscription.category_id);
        this.isHighestLimit = this.hasHighestLimitReached();
        this.isFreeTrial = this.hasFreeOption();
        this.isDiscountAvailable = !!this.subscriptionsService.getDefaultTierDiscount(this.categorySubscription);
      })
    );
  }

  private hasFreeOption(): boolean {
    if (!this.categorySubscription || !!this.categorySubscription.subscribed_from) {
      return false;
    }
    return this.subscriptionsService.hasTrial(this.categorySubscription);
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
    return this.translateService.translate(this.isHighestLimitConfig[this.categorySubscription.category_id].zendesk);
  }
}
