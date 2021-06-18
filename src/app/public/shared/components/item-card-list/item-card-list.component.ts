import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
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
  @ContentChild('inlineSlotTemplate') inlineSlotTemplate: TemplateRef<unknown>;

  public cardTypes = CARD_TYPES;
  public readonly INLINE_SLOT_POSITION = 6;
  private static DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS = 15;

  constructor(private itemCardService: ItemCardService, private checkSessionService: CheckSessionService) {}

  public toggleFavourite(item: ItemCard): void {
    if (this.checkSessionService.hasSession()) {
      this.itemCardService.toggleFavourite(item);
      this.toggleFavouriteEvent.emit(item);
    } else {
      this.checkSessionService.checkSessionAction();
    }
  }

  public trackItemCardClick({ itemCard, index }: ClickedItemCard): void {
    this.clickedItemAndIndex.emit({ itemCard, index });
  }
}
