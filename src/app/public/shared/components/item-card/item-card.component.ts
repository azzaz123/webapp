import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';
import { PERMISSIONS } from '@core/user/user-constants';
import { Image } from '@core/user/user-response.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';

@Component({
  selector: 'tsl-public-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent {
  @Input() item: ItemCard;
  @Input() showDescription = true;
  @Input() showFavourite = true;
  @Input() index: number;
  @Output() toggleFavourite: EventEmitter<{ item: ItemCard; loginSource: string }> = new EventEmitter<{
    item: ItemCard;
    loginSource: string;
  }>();
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor() {}

  public toggleItemFavorite(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    const loginSource = event.currentTarget.getAttribute('data-loginsource');
    this.toggleFavourite.emit({ item: this.item, loginSource });
  }

  get mainImage(): Image {
    return this.item.images.length ? this.item.images[0] : null;
  }
}
