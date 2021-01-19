import { Component, Input } from '@angular/core';
import { ITEM_FLAG_TYPES, FlagProperties, FLAGS } from './item-flag-constants';

@Component({
  selector: 'tsl-item-flag',
  templateUrl: './item-flag.component.html',
  styleUrls: ['./item-flag.component.scss'],
})
export class ItemFlagComponent {
  public readonly ITEM_FLAG_TYPES = ITEM_FLAG_TYPES;
  @Input() type: ITEM_FLAG_TYPES = ITEM_FLAG_TYPES.DEFAULT;
  constructor() {}

  get flag(): FlagProperties {
    return FLAGS.find((flag: FlagProperties) => flag.itemType === this.type);
  }
}
