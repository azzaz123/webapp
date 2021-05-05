import { isPromise } from '@angular/compiler/src/util';
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
import { UserService } from '@core/user/user.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchListTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

  public trackClickItemCardEvent(itemCard: ItemCard, index: number, searchId: string): void {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        position: index + 1,
        searchId: searchId,
        screenId: SCREEN_IDS.Search,
        isPro: this.isPro(),
        salePrice: itemCard.salePrice,
        title: itemCard.title,
        itemDistance: this.itemDistance(),
        shippingAllowed: !!itemCard.saleConditions?.shipping_allowed,
        sellerUserId: itemCard.ownerId,
        isBumped: !!itemCard.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private isPro(): boolean | undefined {
    return this.userService.isPro;
  }

  private itemDistance(): number | undefined {
    return this.userService.user?.itemDistance;
  }
}
