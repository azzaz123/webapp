import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/analytics/analytics.service';
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
  /*  @Output() clickedItem: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() clickedItemIndex: EventEmitter<Number> = new EventEmitter<Number>(); */
  @Output() clickedItemAndIndex: EventEmitter<{ item: Item; index: number }> = new EventEmitter<{ item: Item; index: number }>();

  constructor(
    private deviceDetectionService: DeviceDetectorService,
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {
    this.showDescription = !this.deviceDetectionService.isMobile();
  }

  public toggleFavourite(item: Item): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(item) : this.checkSessionService.checkSessionAction();
  }

  public openItemDetailPage(item: Item, index: number): void {
    /*  this.clickedItem.emit(item);
    this.clickedItemIndex.emit(index); */
    console.log('test', item, index);
    this.clickedItemAndIndex.emit({ item, index });
    this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${item.id}`]);
  }
}
