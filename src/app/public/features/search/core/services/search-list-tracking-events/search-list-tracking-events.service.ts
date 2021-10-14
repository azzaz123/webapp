import { Injectable } from '@angular/core';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  FavoriteItem,
  SCREEN_IDS,
  UnfavoriteItem,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { User } from '@core/user/user';
import { UserService, USER_TYPE } from '@core/user/user.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchListTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService) {}

  public async trackClickItemCardEvent(itemCard: ItemCard, index: number, searchId: string): Promise<void> {
    const { featured, type } = await this.userService.get(itemCard.ownerId).toPromise();

    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        position: index + 1,
        searchId: searchId,
        screenId: SCREEN_IDS.Search,
        isPro: featured,
        isCarDealer: type === USER_TYPE.PROFESSIONAL,
        salePrice: itemCard.salePrice,
        title: itemCard.title,
        itemDistance: itemCard.distance,
        shippingAllowed: !!itemCard.saleConditions?.shipping_allowed,
        sellerUserId: itemCard.ownerId,
        isBumped: !!itemCard.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public async trackFavouriteItemEvent(item: ItemCard, searchId: string): Promise<void> {
    const event: AnalyticsEvent<FavoriteItem> = {
      name: ANALYTICS_EVENT_NAMES.FavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        searchId: searchId,
        screenId: SCREEN_IDS.Search,
        isPro: item.ownerId && (await this.isProByUserId(item.ownerId).toPromise()),
        salePrice: item.salePrice,
        title: item.title,
        sellerUserId: item.ownerId,
        isBumped: !!item.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public async trackUnfavouriteItemEvent(item: ItemCard): Promise<void> {
    const event: AnalyticsEvent<UnfavoriteItem> = {
      name: ANALYTICS_EVENT_NAMES.UnfavoriteItem,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        screenId: SCREEN_IDS.Search,
        isPro: item.ownerId && (await this.isProByUserId(item.ownerId).toPromise()),
        salePrice: item.salePrice,
        title: item.title,
        sellerUserId: item.ownerId,
        isBumped: !!item.bumpFlags?.bumped,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private isProByUserId(userId: string): Observable<boolean> {
    return new Observable((observer) => {
      try {
        this.userService.get(userId).subscribe(
          (user: User) => {
            observer.next(user.featured);
          },
          () => {
            observer.next(null);
          },
          () => {
            observer.complete();
          }
        );
      } catch {
        observer.next(null);
        observer.complete();
      }
    });
  }
}
