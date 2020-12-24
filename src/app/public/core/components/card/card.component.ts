import { Component, Input, OnInit } from '@angular/core';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-public-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() item: Item;

  constructor() {}

  ngOnInit(): void {}
}
