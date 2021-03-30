import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';
import { ItemCard } from './interfaces/item-card.interface';

@Component({
  selector: 'tsl-public-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() item: ItemCard;
  @Input() showDescription = true;
  @Input() showFavourite = true;
  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;

  constructor() {}

  public toggleItemFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
