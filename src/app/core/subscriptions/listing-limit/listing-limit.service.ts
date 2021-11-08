import { Injectable } from '@angular/core';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewProSubscriptionPopup } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ItemService } from '@core/item/item.service';
import {
  SubscriptionsResponse,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_CATEGORY_TYPES,
  Tier,
  TierDiscount,
} from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { ProModalConfig, REDIRECT_TYPE } from '@shared/modals/pro-modal/pro-modal.interface';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE } from './listing-limit.constants';
@Injectable()
export class ListingLimitService {
  constructor(
    private modalService: NgbModal,
    private analyticsService: AnalyticsService,
    private itemService: ItemService,
    private subscriptionsService: SubscriptionsService,
    private customerHelpService: CustomerHelpService
  ) {}

  public showModal(itemId: string, type: SUBSCRIPTION_TYPES): NgbModalRef {
    const modal = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    if (type === SUBSCRIPTION_TYPES.carDealer) {
      modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit];
      return modal;
    }

    return this.handleListingLimitModal(itemId, type, modal);
  }

  private trackPageView(
    categorySubscription: SubscriptionsResponse,
    type: SUBSCRIPTION_TYPES,
    isFreeTrial: boolean,
    tierDicounted: Tier
  ): void {
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

  private hasHighestLimitReached(categorySubscription: SubscriptionsResponse): boolean {
    return (
      this.subscriptionsService.hasHighestLimit(categorySubscription) &&
      CATEGORIES_WITH_HIGHEST_LIMIT_ACTIVE.includes(categorySubscription.category_id)
    );
  }

  private zenDeskUrl(key: CUSTOMER_HELP_PAGE): string {
    return this.customerHelpService.getPageUrl(key);
  }

  private handleListingLimitModal(itemId: string, type: SUBSCRIPTION_TYPES, modal: NgbModalRef): NgbModalRef {
    forkJoin([this.itemService.get(itemId), this.subscriptionsService.getSubscriptions(false)])
      .pipe(take(1))
      .subscribe((values) => {
        const item = values[0];
        const subscriptions = values[1];
        const categorySubscription = this.subscriptionsService.getSubscriptionByCategory(subscriptions, item.categoryId);
        const isHighestLimit = this.hasHighestLimitReached(categorySubscription);
        const isFreeTrial = this.subscriptionsService.hasFreeTrialByCategoryId(subscriptions, item.categoryId);
        const tierDicounted = this.subscriptionsService.tierDiscountByCategoryId(subscriptions, item.categoryId);

        this.trackPageView(categorySubscription, type, isFreeTrial, tierDicounted);

        if (isHighestLimit) {
          modal.componentInstance.modalConfig = this.handleHighestLimitConfig(categorySubscription.type);
          return;
        }

        if (categorySubscription.subscribed_from) {
          modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_tier_limit];
          return;
        }

        if (isFreeTrial) {
          modal.componentInstance.modalConfig = this.handleFreeTrialConfig(categorySubscription.trial_days);
          return;
        }

        if (tierDicounted) {
          modal.componentInstance.modalConfig = this.handleDiscountConfig(tierDicounted.discount);
          return;
        }

        modal.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_no_trial_no_discount];
      });
    return modal;
  }

  private handleHighestLimitConfig(subscriptionType: SUBSCRIPTION_CATEGORY_TYPES): ProModalConfig {
    if (subscriptionType === SUBSCRIPTION_CATEGORY_TYPES.CARS) {
      return modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit];
    }
    if (subscriptionType === SUBSCRIPTION_CATEGORY_TYPES.REAL_ESTATE) {
      const proModalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_real_estate_highest_limit];
      proModalConfig.buttons.primary.redirect = {
        type: REDIRECT_TYPE.href,
        url: this.zenDeskUrl(CUSTOMER_HELP_PAGE.PROS_REAL_ESTATE_SUBSCRIPTION),
      };
      return proModalConfig;
    }
    if (subscriptionType === SUBSCRIPTION_CATEGORY_TYPES.CONSUMER_GOODS) {
      const proModalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_consumer_good_highest_limit];
      proModalConfig.buttons.primary.redirect = {
        type: REDIRECT_TYPE.href,
        url: this.zenDeskUrl(CUSTOMER_HELP_PAGE.PROS_CONSUMER_GOODS_SUBSCRIPTION),
      };
      return proModalConfig;
    }
  }

  private handleFreeTrialConfig(trialDays: number): ProModalConfig {
    const proModalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_trial];
    proModalConfig.text1 = $localize`:@@listing_limit_non_pro_users_free_trial_available_description_part_1:To list more items of this category, try Wallapop PRO with a ${trialDays}:INTERPOLATION:-day free trial. Professionalise your online sales, and sell more!`;
    return proModalConfig;
  }

  private handleDiscountConfig(tierDiscount: TierDiscount): ProModalConfig {
    const proModalConfig = modalConfig[PRO_MODAL_TYPE.listing_limit_discount];
    proModalConfig.buttons.primary.text = $localize`:@@listing_limit_non_pro_users_discount_modal_start_button:Try with ${tierDiscount.percentage}:INTERPOLATION:% discount`;
    return proModalConfig;
  }
}
