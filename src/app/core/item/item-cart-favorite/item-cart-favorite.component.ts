import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item } from 'shield';
import { ItemService } from '../../../core/item/item.service';

@Component({
  selector: 'tsl-item-cart-favorite',
  templateUrl: './item-cart-favorite.component.html',
  styleUrls: ['./item-cart-favorite.component.scss']
})
export class ItemCartFavoriteComponent implements OnInit {

  @Input() item: Item;
  @Output() onFavoriteChange: EventEmitter<Item> = new EventEmitter();

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
  }

  favorite() {
    const favorite = !this.item.favorited;
    this.itemService.favoriteItem(this.item.id, favorite).subscribe(() => {
      this.item.favorited = favorite;
      this.onFavoriteChange.emit(this.item);
    });
  }

}
