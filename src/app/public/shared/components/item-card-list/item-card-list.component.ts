import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { CARD_TYPES } from './enums/card-types.enum';
import { ClickedItemCard } from './interfaces/clicked-item-card.interface';
import { ColumnsConfig } from './interfaces/cols-config.interface';
import { SlotsConfig } from './interfaces/slots-config.interface';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardListComponent {
  private static DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS = 15;

  @Input() items: ItemCard[];
  @Input() showDescription = true;
  @Input() showPlaceholder = false;
  @Input() showNativeAdSlots = false;
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
  public readonly INLINE_SLOT_POSITION = 6;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor(private itemCardService: ItemCardService, private checkSessionService: CheckSessionService) {}

  public toggleFavourite(event: { item: ItemCard; loginSource: string }): void {
    const { item, loginSource } = event;
    if (this.checkSessionService.hasSession()) {
      this.itemCardService.toggleFavourite(item);
      this.toggleFavouriteEvent.emit(item);
    } else {
      this.checkSessionService.checkSessionAction(loginSource);
    }
  }

  public trackItemCardClick({ itemCard, index }: ClickedItemCard): void {
    this.clickedItemAndIndex.emit({ itemCard, index });
  }
}
