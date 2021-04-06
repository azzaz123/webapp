import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { environment } from '@environments/environment';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
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
    @Inject('SUBDOMAIN') private subdomain: string
  ) {
    this.showDescription = !this.deviceDetectionService.isMobile();
  }

  public toggleFavourite(item: Item): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(item) : this.checkSessionService.checkSessionAction();
  }

  public openItemDetailPage(item: Item): void {
    const link = environment.siteUrl.replace('es', this.subdomain) + 'item/' + item.webSlug;
    window.open(link);

    // TODO: UNCOMMENT WHEN WE OPEN ITEM DETAIL IN PRODUCTION		Date: 2021/04/01
    // this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${item.id}`]);
  }
}
