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
import { SearchIdService } from '@core/analytics/search/search-id/search-id.service';
import { User } from '@core/user/user';
import { UserService, USER_TYPE } from '@core/user/user.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SearchListTrackingEventsService {
  constructor(private analyticsService: AnalyticsService, private userService: UserService, private searchIdService: SearchIdService) {}

  public async trackClickItemCardEvent(itemCard: ItemCard, index: number, searchId: string | null): Promise<void> {
    let isFeatured: boolean = null;
    let isCarDealer: boolean = null;

    if (itemCard?.ownerId) {
      const user = await this.userService.get(itemCard.ownerId).toPromise();
      isFeatured = user.featured;
      isCarDealer = user.type === USER_TYPE.PROFESSIONAL;
    }

    this.updateSearchIdByItemId(itemCard.id, searchId);

    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: itemCard.id,
        categoryId: itemCard.categoryId,
        position: index + 1,
        searchId: searchId,
        screenId: SCREEN_IDS.Search,
        isPro: isFeatured,
        isCarDealer: isCarDealer,
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

  private updateSearchIdByItemId(itemId: string, searchId: string | null): void {
    searchId ? this.searchIdService.setSearchIdByItemId(itemId, searchId) : this.searchIdService.deleteSearchIdByItemId(itemId);
  }
}
