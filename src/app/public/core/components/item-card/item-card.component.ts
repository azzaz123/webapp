import { Component, Input, OnInit } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-public-ItemCard',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() showDescription = true;

  constructor() {}

  ngOnInit(): void {}
}
