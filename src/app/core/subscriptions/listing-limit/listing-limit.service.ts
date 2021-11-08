import { Injectable } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewProSubscriptionPopup } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ItemService } from '@core/item/item.service';
import { SUBSCRIPTION_CATEGORIES, SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export const CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE = [
  CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE,
  CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS,
  CATEGORY_SUBSCRIPTIONS_IDS.CAR,
];

import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { ProModalConfig, REDIRECT_TYPE } from '@shared/modals/pro-modal/pro-modal.interface';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '../category-subscription-ids';
@Injectable()
export class ListingLimitService {
  constructor(
    private modalService: NgbModal,
    private analyticsService: AnalyticsService,
    private itemService: ItemService,
    private subscriptionsService: SubscriptionsService,
    private customerHelpService: CustomerHelpService
  ) {}

  showModal(itemId: string, type: SUBSCRIPTION_TYPES): NgbModalRef {
    const modal = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    this.getSubscriptionInfo(itemId)
      .pipe(take(1))
      .subscribe((values) => {
        const item = values[0];
        const subscriptions = values[1];
        const categorySubscription = this.subscriptionsService.getSubscriptionByCategory(subscriptions, item.categoryId);
        const isHighestLimit = this.hasHighestLimitReached(categorySubscription);
        const isFreeTrial = this.subscriptionsService.hasFreeTrialByCategoryId(subscriptions, item.categoryId);
        const tierDicounted = this.subscriptionsService.tierDiscountByCategoryId(subscriptions, item.categoryId);

        this.trackPageView(categorySubscription, type, isFreeTrial, tierDicounted);

        if (type === SUBSCRIPTION_TYPES.carDealer) {
          modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit];
          return modal;
        }

        if (isHighestLimit) {
          if (categorySubscription.type === SUBSCRIPTION_CATEGORY_TYPES.CARS) {
            modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit];
            return modal;
          }
          if (categorySubscription.type === SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE) {
            modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_real_estate_highest_limit];
            modal.componentInstance.modalConfig.buttons.primary['redirect'] = {
              type: REDIRECT_TYPE.href,
              url: this.zenDeskUrl(CUSTOMER_HELP_PAGE.PROS_REAL_ESTATE_SUBSCRIPTION),
            };
            return modal;
          }
          if (categorySubscription.type === SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS) {
            modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_consumer_good_highest_limit];
            modal.componentInstance.modalConfig.buttons.primary['redirect'] = {
              type: REDIRECT_TYPE.href,
              url: this.zenDeskUrl(CUSTOMER_HELP_PAGE.PROS_CONSUMER_GOODS_SUBSCRIPTION),
            };
            return modal;
          }
        }

        if (categorySubscription.subscribed_from) {
          modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_tier_limit];
          return modal;
        }

        if (isFreeTrial) {
          modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_trial];
          modal.componentInstance.modalConfig.text1 = $localize`:@@listing_limit_non_pro_users_free_trial_available_description_part_1:To list more items of this category, try Wallapop PRO with a ${categorySubscription.trial_days}:INTERPOLATION:-day free trial. Professionalise your online sales, and sell more!`;
          return modal;
        }

        if (tierDicounted) {
          const config: ProModalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_discount];
          config.buttons.primary.text = $localize`:@@listing_limit_non_pro_users_discount_modal_start_button:Try with ${tierDicounted.discount.percentage}:INTERPOLATION:% discount`;
          modal.componentInstance.modalConfig = config;
          return modal;
        }

        modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_no_trial_no_discount];
      });
    return modal;
  }

  private getSubscriptionInfo(itemId: string): Observable<any> {
    return forkJoin([this.itemService.get(itemId), this.subscriptionsService.getSubscriptions(false)]);
  }

  private trackPageView(categorySubscription, type, isFreeTrial, tierDicounted): void {
    const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
      attributes: {
        screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
        subscription: categorySubscription.category_id as SUBSCRIPTION_CATEGORIES,
        freeTrial: isFreeTrial,
        isCarDealer: type === SUBSCRIPTION_TYPES.carDealer,
        discount: !!tierDicounted,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private hasHighestLimitReached(categorySubscription): boolean {
    return (
      this.subscriptionsService.hasHighestLimit(categorySubscription) &&
      CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE.includes(categorySubscription.category_id)
    );
  }

  private zenDeskUrl(key: CUSTOMER_HELP_PAGE): string {
    return this.customerHelpService.getPageUrl(key);
  }
}
