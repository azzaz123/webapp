import { Component, Input, OnChanges } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { InboxItem } from '@private/features/chat/core/model';
import { environment } from '../../../environments/environment';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from '../../core/item/item';

@Component({
  selector: 'tsl-item-avatar',
  templateUrl: './item-avatar.component.html',
  styleUrls: ['./item-avatar.component.scss'],
})
export class ItemAvatarComponent implements OnChanges {
  public avatar: string;
  public fallback: string;
  public readonly PERMISSIONS = PERMISSIONS;
  @Input() fallbackLight: boolean;
  @Input() item: Item;
  @Input() inboxItem: InboxItem;
  @Input() size: 'small' | 'medium' | 'big' | 'bigger' | 'xl' | 'rectangle-xl' | 'full';
  @Input() showAvailableStatus = true;

  constructor() {}

  ngOnChanges(changes?: any) {
    this.avatar = this.item && this.item.mainImage && this.item.mainImage.urls_by_size ? this.item.mainImage.urls_by_size.small : '';
    if (environment.production || environment.name === 'beta') {
      this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
    }
    this.fallback = this.fallbackLight ? FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH : FAKE_ITEM_IMAGE_SMALL_BASE_PATH;
  }
}
