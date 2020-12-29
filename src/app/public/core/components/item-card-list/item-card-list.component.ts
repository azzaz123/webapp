import { Component, Input } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
})
export class ItemCardListComponent {
  @Input() items: Item[];

  constructor() {}
}
