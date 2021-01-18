import { Component, Input, OnInit } from '@angular/core';

export enum ITEM_FLAG_TYPES {
  TEXT = 'text',
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
export class ItemFlagComponent implements OnInit {
  @Input() type: ITEM_FLAG_TYPES;
  @Input() message: string;
  constructor() {}

  ngOnInit(): void {}
}
