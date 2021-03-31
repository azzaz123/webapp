import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemDetailTrackEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackFavoriteOrUnfavoriteEvent(itemDetail: ItemDetail): void {
    const event: AnalyticsEvent<FavoriteItem | UnfavoriteItem> = {
      name: itemDetail.item.flags.favorite ? ANALYTICS_EVENT_NAMES.FavoriteItem : ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: itemDetail.item.id,
        categoryId: itemDetail.item.categoryId,
        screenId: SCREEN_IDS.ItemDetail,
        salePrice: itemDetail.item.salePrice,
        isPro: itemDetail.user.featured,
        title: itemDetail.item.title,
        isBumped: !!itemDetail.item.bumpFlags,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
