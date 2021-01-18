import { Component, Input } from '@angular/core';
import { ITEM_FLAG_TYPES } from './item-flag-constants';

@Component({
  selector: 'tsl-item-flag',
  templateUrl: './item-flag.component.html',
  styleUrls: ['./item-flag.component.scss'],
})
export class ItemFlagComponent {
  @Input() type: ITEM_FLAG_TYPES = ITEM_FLAG_TYPES.DEFAULT;
  constructor() {}
}
