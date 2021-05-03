import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Inject, Input, Output, TemplateRef } from '@angular/core';
import { environment } from '@environments/environment';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { CARD_TYPES } from './enums/card-types.enum';
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
  @Input() showPlaceholder = false;
  @Input() placeholderCards = ItemCardListComponent.DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS;
  @Input() columnsConfig: ColumnsConfig = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;
  @Input() slotsConfig: SlotsConfig;
  @Input() isLoading: boolean;
  @Output() clickedItemAndIndex: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();
  @Output() toggleFavouriteEvent: EventEmitter<ItemCard> = new EventEmitter<ItemCard>();

  @ContentChild('slotTemplate') slotTemplate: TemplateRef<unknown>;

  public cardTypes = CARD_TYPES;
  private static DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS = 15;

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
