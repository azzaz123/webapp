import { Component, Input } from '@angular/core';

export enum ITEM_FLAG_TYPES {
  DEFAULT = 'text',
  SOLD = 'sold',
  RESERVED = 'reserved',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
  FEATURED = 'featured',
}
@Component({
  selector: 'tsl-item-flag',
  templateUrl: './item-flag.component.html',
  styleUrls: ['./item-flag.component.scss'],
})
export class ItemFlagComponent {
  @Input() type: ITEM_FLAG_TYPES = ITEM_FLAG_TYPES.DEFAULT;
  constructor() {}
}
