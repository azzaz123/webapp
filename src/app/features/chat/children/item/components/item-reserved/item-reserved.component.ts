import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-item-reserved',
  templateUrl: './item-reserved.component.html',
  styleUrls: ['./item-reserved.component.scss'],
})
export class ItemReservedComponent {
  @Input() item: Item;
}
