import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';
import { InboxItem } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-item-sold',
  templateUrl: './item-sold.component.html',
  styleUrls: ['./item-sold.component.scss'],
})
export class ItemSoldComponent {
  @Input() item: Item | InboxItem;

  constructor() {}
}
