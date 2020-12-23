import { Component, Input, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';

@Component({
  selector: 'tsl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() item: Item;

  constructor() {}

  ngOnInit(): void {
    this.item = MOCK_ITEM;
  }
}
