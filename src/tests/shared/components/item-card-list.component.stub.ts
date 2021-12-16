import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { SlotsConfig } from '@public/shared/components/item-card-list/interfaces/slots-config.interface';

@Component({
  selector: 'tsl-public-item-card-list',
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ItemCardListComponentStub {
  @Input() items: Item[];
  @Input() showDescription = true;
  @Input() columnsConfig: ColumnsConfig;
  @Input() slotsConfig: SlotsConfig;
  @Input() cardType: CARD_TYPES;
  @Input() isLoading: boolean;
  @Input() showPlaceholder: boolean;
  @Input() showNativeAdSlots: boolean;
  @Output() toggleFavouriteEvent: EventEmitter<ItemCard> = new EventEmitter<ItemCard>();
}
