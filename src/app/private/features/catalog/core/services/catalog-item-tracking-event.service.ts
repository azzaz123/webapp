import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ReactivateItem,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { UserService } from '@core/user/user.service';

@Injectable()
export class CatalogItemTrackingEventService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

  public trackReactivateItemEvent(item: Item): void {
    const event: AnalyticsEvent<ReactivateItem> = {
      name: ANALYTICS_EVENT_NAMES.ReactivateItem,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        subcategoryId: parseInt(item.extraInfo?.object_type?.id, 10),
        salePrice: item.salePrice,
        title: item.title,
        brand: item.extraInfo?.brand,
        model: item.extraInfo?.model,
        objectType: item.extraInfo?.object_type.name,
        isPro: this.userService.isPro,
        screenId: SCREEN_IDS.MyCatalog,
        // hashtags: '', to be added on the future
        // shippingAllowed: null,  to be added on the future
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
