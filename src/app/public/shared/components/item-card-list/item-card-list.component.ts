import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { environment } from '@environments/environment';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ClickedItemCard } from './interfaces/clicked-item-card.interface';
import { ColumnsConfig } from './interfaces/cols-config.interface';
import { SlotsConfig } from './interfaces/slots-config.interface';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardListComponent {
  @Input() items: ItemCard[];
  @Input() showDescription = true;
  @Input() columnsConfig: ColumnsConfig = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };
  @Input() slotsConfig: SlotsConfig;
  @Output() clickedItemAndIndex: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();
  @Output() toggleFavouriteEvent: EventEmitter<ItemCard> = new EventEmitter<ItemCard>();

  constructor(
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  public toggleFavourite(item: ItemCard): void {
    if (this.checkSessionService.hasSession()) {
      this.itemCardService.toggleFavourite(item);
      this.toggleFavouriteEvent.emit(item);
    } else {
      this.checkSessionService.checkSessionAction();
    }
  }

  public openItemDetailPage({ itemCard, index }: ClickedItemCard): void {
    this.clickedItemAndIndex.emit({ itemCard, index });
    const link = environment.siteUrl.replace('es', this.subdomain) + 'item/' + itemCard.webSlug;
    window.open(link);

    // TODO: UNCOMMENT WHEN WE OPEN ITEM DETAIL IN PRODUCTION		Date: 2021/04/01
    // this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${item.id}`]);
  }
}
