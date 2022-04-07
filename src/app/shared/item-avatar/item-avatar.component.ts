import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { InboxItem } from '@private/features/chat/core/model';
import { environment } from '../../../environments/environment';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from '../../core/item/item';

@Component({
  selector: 'tsl-item-avatar',
  templateUrl: './item-avatar.component.html',
  styleUrls: ['./item-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemAvatarComponent implements OnChanges {
  @Input() fallbackLight: boolean;
  @Input() item: Item | InboxItem;
  @Input() size: 'small' | 'medium' | 'big' | 'bigger' | 'xl' | 'rectangle-xl' | 'full';
  @Input() showAvailableStatus = true;
  public avatar: string;
  public fallback: string;
  public readonly PERMISSIONS = PERMISSIONS;

  ngOnChanges(changes?: any) {
    this.avatar = this.item && this.item.mainImage && this.item.mainImage.urls_by_size ? this.item.mainImage.urls_by_size.small : '';
    if (environment.production || environment.name === 'beta') {
      this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
    }
    this.fallback = this.fallbackLight ? FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH : FAKE_ITEM_IMAGE_SMALL_BASE_PATH;
  }

  get showOverlay(): boolean {
    if (this.item instanceof Item && this.item.featured) {
      return true;
    }
    return this.item.sold || this.item.reserved || this.item.notAvailable;
  }

  get isSold(): boolean {
    return this.item.sold && !this.item.notAvailable;
  }

  get isReserved(): boolean {
    if (this.item instanceof Item && (this.item.featured || this.item.purchases)) {
      return false;
    }
    return this.item.reserved && !this.item.sold && !this.item.notAvailable;
  }

  get isFeatured(): boolean {
    return this.item instanceof Item && this.item.featured && !this.item.purchases && !this.item.sold && !this.item.flags.onhold;
  }

  get isFeaturedScheduled(): boolean {
    return this.item instanceof Item && this.item.purchases && !this.item.sold && !this.item.flags.onhold;
  }

  get isNotAvailable(): boolean {
    return this.item.notAvailable && this.showAvailableStatus;
  }
}
