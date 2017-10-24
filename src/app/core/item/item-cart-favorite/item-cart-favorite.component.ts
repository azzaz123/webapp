import { Component, OnInit, Input } from '@angular/core';

import { Item } from 'shield';
import { ItemService } from '../../../core/item/item.service';
import {log} from "util";

@Component({
  selector: 'tsl-item-cart-favorite',
  templateUrl: './item-cart-favorite.component.html',
  styleUrls: ['./item-cart-favorite.component.scss']
})
export class ItemCartFavoriteComponent implements OnInit {

  @Input() item: Item;
  public images;

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
  }

  favorite() {
  }

}
