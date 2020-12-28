import { Component, Input, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';

@Component({
  selector: 'tsl-public-ItemCard',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() showDescription = true;
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;

  constructor() {}

  ngOnInit(): void {}
}
