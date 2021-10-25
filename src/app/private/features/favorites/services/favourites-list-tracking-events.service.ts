import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  SCREEN_IDS,
  UnfavoriteItem,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { UserService, USER_TYPE } from '@core/user/user.service';

@Injectable()
export class FavouritesListTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

  public async trackClickItemCardEvent(item: Item, index: number): Promise<void> {
    const { id, categoryId, salePrice, title, flags, owner } = item;
    const { featured, type } = await this.userService.get(owner).toPromise();

    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: id,
        categoryId: categoryId,
        position: index + 1,
        screenId: SCREEN_IDS.MyFavoriteItemsSection,
        salePrice: salePrice,
        title: title,
        isBumped: flags?.bumped,
        isPro: featured,
        isCarDealer: type === USER_TYPE.PROFESSIONAL,
      },
    };

    this.analyticsService.trackEvent(event);
  }

  public trackUnfavouriteItemEvent(item: Item): void {
    const { id, categoryId, salePrice, title, flags } = item;

    const event: AnalyticsEvent<UnfavoriteItem> = {
      name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: id,
        categoryId: categoryId,
        screenId: SCREEN_IDS.MyFavoriteItemsSection,
        salePrice: salePrice,
        title: title,
        isBumped: flags?.bumped,
      },
    };

    this.analyticsService.trackEvent(event);
  }
}
