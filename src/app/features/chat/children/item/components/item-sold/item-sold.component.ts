import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-item-sold',
  templateUrl: './item-sold.component.html',
  styleUrls: ['./item-sold.component.scss'],
})
export class ItemSoldComponent {
  @Input() item: Item;

  constructor() {}
}
