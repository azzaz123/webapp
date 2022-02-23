import { Injectable } from '@angular/core';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, PayBumpItems, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';

@Injectable()
export class BumpsTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

  public trackPayBumpItems(selectedItems: SelectedProduct[], totalToPay: number): void {
    const pageViewEvent: AnalyticsEvent<PayBumpItems> = {
      name: ANALYTICS_EVENT_NAMES.PayBumpItems,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        screenId: SCREEN_IDS.BumpCheckout,
        isPro: this.userService.isPro,
        bumps: selectedItems.length,
        subscriptionBumps: selectedItems.filter((selectedItem) => selectedItem.isFree).length,
        zoneBumps: selectedItems.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.ZONE_BUMP).length,
        cityBumps: selectedItems.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.CITY_BUMP).length,
        countryBumps: selectedItems.filter((selectedItem) => selectedItem.productType === BUMP_TYPE.COUNTRY_BUMP).length,
        amountPaid: totalToPay,
      },
    };

    this.analyticsService.trackEvent(pageViewEvent);
  }
}
