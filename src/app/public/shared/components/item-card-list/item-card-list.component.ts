import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCard,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { Item } from '@core/item/item';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ColumnsConfig } from './interfaces/cols-config.interface';
import { SlotsConfig } from './interfaces/slots-config.interface';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardListComponent {
  @Input() items: Item[];
  @Input() showDescription = true;
  @Input() columnsConfig: ColumnsConfig = {
    lg: 5,
    md: 4,
    sm: 3,
    xs: 2,
  };
  @Input() slotsConfig: SlotsConfig;

  constructor(
    private deviceDetectionService: DeviceDetectorService,
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService,
    private router: Router
  ) {
    this.showDescription = !this.deviceDetectionService.isMobile();
  }

  public toggleFavourite(item: Item): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(item) : this.checkSessionService.checkSessionAction();
  }

  public openItemDetailPage(item: Item): void {
    this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${item.id}`]);
  }

  private trackClickItemCardEvent(item: Item) {
    const event: AnalyticsEvent<ClickItemCard> = {
      name: ANALYTICS_EVENT_NAMES.ClickItemCard,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      /*  attributes: {
        itemId: item.id,
        categoryId: item.categoryId,
        position: null, // Need to check about the position
        screenId: SCREEN_IDS.ItemDetailRecommendationSlider,
        isPro: false,
        salePrice: item.salePrice,
        title: item.title,
        itemDistance: item.km,
        shippingAllowed: item.saleConditions.shipping_allowed,
        sellerUserId: item.
      }, */
    };
    //this.analyticsService.trackEvent(event);
  }
}
