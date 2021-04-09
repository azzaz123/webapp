import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickChatButton,
  FavoriteItem,
  SCREEN_IDS,
  ShareItem,
  UnfavoriteItem,
  ViewItemDetailRecommendationSlider,
  ViewOthersItemCarDetail,
  ViewOthersItemCGDetail,
  ViewOthersItemREDetail,
  ViewOwnItemDetail,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Realestate } from '@core/item/realestate';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { SEARCH_TECHNIQUE_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { ItemDetail } from '@public/features/item-detail/interfaces/item-detail.interface';
import { SOCIAL_SHARE_CHANNELS } from '@shared/social-share/enums/social-share-channels.enum';
import { finalize, take } from 'rxjs/operators';

@Injectable()
export class ItemDetailTrackEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

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
        isBumped: !!itemDetail.item.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackClickChatButton(item: Item, user: User): void {
    const event: AnalyticsEvent<ClickChatButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickChatButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: item.id,
        sellerUserId: user.id,
        screenId: SCREEN_IDS.ItemDetail,
        isPro: user.featured,
        isBumped: !!item.bumpFlags?.bumped,
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

  public trackShareItemEvent(channel: SOCIAL_SHARE_CHANNELS, item: Item, user: User): void {
    const event: AnalyticsEvent<ShareItem> = {
      name: ANALYTICS_EVENT_NAMES.ShareItem,
      eventType: ANALYTIC_EVENT_TYPES.Social,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        channel: channel,
        screenId: SCREEN_IDS.ItemDetail,
        isPro: user.featured,
        salePrice: item.salePrice,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public trackViewOthersItemREDetailEvent(item: Realestate, user: User): void {
    const event: AnalyticsPageView<ViewOthersItemREDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOthersItemREDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        title: item.title,
        operation: item.operation,
        type: item.type,
        condition: item.condition,
        surface: item.surface,
        rooms: item.rooms,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackViewItemDetailRecommendationSliderEvent(
    item: Item,
    user: User,
    recommendedItemIds: string,
    engine: SEARCH_TECHNIQUE_ENGINE
  ): void {
    const event: AnalyticsPageView<ViewItemDetailRecommendationSlider> = {
      name: ANALYTICS_EVENT_NAMES.ViewItemDetailRecommendationSlider,
      attributes: {
        itemSourceId: item.id,
        categoryId: item.categoryId,
        engine: engine,
        recommendedItemIds: recommendedItemIds,
        screenId: 115,
        isPro: user.featured,
      },
    };
    this.analyticsService.trackPageView(event);
  }

  public trackViewOthersItemCarDetailEvent(item: Car, user: User): void {
    const event: AnalyticsPageView<ViewOthersItemCarDetail> = {
      name: ANALYTICS_EVENT_NAMES.ViewOthersItemCarDetail,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        salePrice: item.salePrice,
        brand: item.brand,
        model: item.model,
        year: item.year,
        km: item.km,
        gearbox: item.gearbox,
        engine: item.engine,
        colour: item.color,
        hp: item.horsepower,
        numDoors: item.numDoors,
        bodyType: item.bodyType,
        isCarDealer: false,
        isPro: user.featured,
        screenId: SCREEN_IDS.ItemDetail,
      },
    };
    this.userService
      .isProfessional()
      .pipe(
        take(1),
        finalize(() => {
          this.analyticsService.trackPageView(event);
        })
      )
      .subscribe((isCarDealer: boolean) => {
        event.attributes.isCarDealer = isCarDealer;
      });
  }
}
