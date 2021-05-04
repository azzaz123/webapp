import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { ItemCard } from '@public/core/interfaces/item-card.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchListTrackingEventsService {
  constructor(private analyticsService: AnalyticsService) {}

  public trackClickItemCardEvent(recommendedItemCard: ItemCard, sourceItem: Item, recommenedItemOwner: User, index: number): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: recommendedItemCard.id,
        categoryId: recommendedItemCard.categoryId,
        position: index + 1,
        screenId: SCREEN_IDS.ItemDetailRecommendationSlider,
        isPro: recommenedItemOwner.featured,
        salePrice: recommendedItemCard.salePrice,
        title: recommendedItemCard.title,
        itemSourceRecommendationId: sourceItem.id,
        itemDistance: recommenedItemOwner.itemDistance,
        shippingAllowed: !!recommendedItemCard.saleConditions?.shipping_allowed,
        sellerUserId: recommendedItemCard.ownerId,
        isBumped: !!recommendedItemCard.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }
}
