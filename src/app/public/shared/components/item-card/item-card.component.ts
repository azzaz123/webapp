import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';

@Component({
  selector: 'tsl-public-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() item: Item;
  @Input() showDescription = true;
  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();

  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;

  constructor() {}
}
