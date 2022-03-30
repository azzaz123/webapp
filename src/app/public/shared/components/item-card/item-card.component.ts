import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';
import { PERMISSIONS } from '@core/user/user-constants';
import { Image } from '@core/user/user-response.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ToggleFavoriteInterface } from '@public/shared/components/item-card-list/interfaces/toggle-favorite.interface';
import { LOGIN_SOURCE } from '@public/shared/components/item-card-list/enums/login-source.enum';

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
  @Output() toggleFavourite: EventEmitter<ToggleFavoriteInterface> = new EventEmitter<ToggleFavoriteInterface>();
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly PERMISSIONS = PERMISSIONS;
  private readonly clickFavLoginSource = LOGIN_SOURCE.FAVORITE_ITEM;

  public toggleItemFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavourite.emit({ item: this.item, loginSource: this.clickFavLoginSource });
  }

  get mainImage(): Image {
    return this.item.images.length ? this.item.images[0] : null;
  }
}
