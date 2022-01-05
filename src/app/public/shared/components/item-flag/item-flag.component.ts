import { Component, Input } from '@angular/core';
import { FlagProperties, FLAGS, STATUS_ITEM_FLAG_TYPES, BUMPED_ITEM_FLAG_TYPES } from './item-flag-constants';

@Component({
  selector: 'tsl-item-flag',
  templateUrl: './item-flag.component.html',
  styleUrls: ['./item-flag.component.scss'],
})
export class ItemFlagComponent {
  @Input() type: STATUS_ITEM_FLAG_TYPES | BUMPED_ITEM_FLAG_TYPES = STATUS_ITEM_FLAG_TYPES.DEFAULT;
  public readonly STATUS_ITEM_FLAG_TYPES = STATUS_ITEM_FLAG_TYPES;
  public readonly BUMPED_ITEM_FLAG_TYPES = BUMPED_ITEM_FLAG_TYPES;

  get flag(): FlagProperties {
    return FLAGS.find((flag: FlagProperties) => flag.itemType === this.type);
  }
}
