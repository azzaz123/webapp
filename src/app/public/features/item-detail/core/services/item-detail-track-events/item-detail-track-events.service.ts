import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickChatButton,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
  ViewOthersItemCGDetail,
  ViewOwnItemDetail,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemDetailTrackEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService, private typeCheckService: TypeCheckService) {}

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

  public trackChatButton(item: Item, user: User): void {
    const event: AnalyticsEvent<ClickChatButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickChatButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: item.id,
        sellerUserId: user.id,
        screenId: SCREEN_IDS.ItemDetail,
        isPro: user.featured,
        isBumped: !!item.bumpFlags,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackViewOwnItemDetail(item: Item, user: User): void {
    const event: AnalyticsPageView<ViewOwnItemDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOwnItemDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        title: item.title,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
        isActive: !item.flags?.onhold,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackViewOthersCGDetailEvent(item: Item, user: User): void {
    const event: AnalyticsPageView<ViewOthersItemCGDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOthersItemCGDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        title: item.title,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
