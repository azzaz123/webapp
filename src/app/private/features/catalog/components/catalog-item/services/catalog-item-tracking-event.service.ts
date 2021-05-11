import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ReactivateItem,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ITEM_TYPES } from '@core/item/item';
import { ItemResponse } from '@core/item/item-response.interface';

@Injectable()
export class CatalogItemTrackingEventService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackReactivateItemEvent(item: ItemResponse, isPro: boolean): void {
    const event: AnalyticsEvent<ReactivateItem> = {
      name: ANALYTICS_EVENT_NAMES.ReactivateItem,
      eventType: ANALYTIC_EVENT_TYPES.Navigation, // TODO check with product
      attributes: {
        itemId: item.id,
        categoryId: this.getCategoryId(item),
        subcategoryId: parseInt(item.content.extra_info?.object_type?.id, 10),
        salePrice: item.content.sale_price,
        title: item.content.title,
        brand: item.content.extra_info?.brand,
        model: item.content.extra_info?.model,
        objectType: item.content.extra_info?.object_type.name,
        isPro: isPro,
        screenId: SCREEN_IDS.MyCatalog,
        // hashtags: '', to be added on the future
        // shippingAllowed: null,  to be added on the future
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private getCategoryId(item: ItemResponse): number {
    let categoryId = item.content.category_id;

    if (!categoryId) {
      if (item.type === ITEM_TYPES.CARS) {
        categoryId = CATEGORY_IDS.CAR;
      }

      if (item.type === ITEM_TYPES.REAL_ESTATE) {
        categoryId = CATEGORY_IDS.REAL_ESTATE;
      }
      return categoryId;
    }
  }
}
