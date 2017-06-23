import { Component, Input, OnChanges } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from 'shield';

@Component({
  selector: 'tsl-item-avatar',
  templateUrl: './item-avatar.component.html',
  styleUrls: ['./item-avatar.component.scss']
})
export class ItemAvatarComponent implements OnChanges {

  public avatar: string;
  public fallback: string;
  @Input() fallbackLight: boolean;
  @Input() item: Item;
  @Input() size: string;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    this.avatar = this.item && this.item.mainImage && this.item.mainImage.urls_by_size ? this.item.mainImage.urls_by_size.small : '';
    this.fallback = this.fallbackLight ? FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH : FAKE_ITEM_IMAGE_SMALL_BASE_PATH;
  }

}
