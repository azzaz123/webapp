import { Component, OnInit } from '@angular/core';

import { ItemService } from '../core/item/item.service';
import { ItemsData } from '../core/item/item-response.interface';
import { Item } from 'shield';

@Component({
  selector: 'tsl-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  // public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = true;
  private init: number = 0;
  private size: number = 20;
  public end:boolean = false;

  public masonryOptions = {
    gutter: 20
  }

  public items = [
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
    // new Item(null, null, null, 'title fjdsaljfdlsaj djsa lfj slkfj lsaddj l', 'Description', null, null, 999, 'EUR', null, null, null, null, null, null, null, null, null),
  ];

  constructor(public itemService: ItemService
  ) { }

  ngOnInit() {
    // this.itemService.mineFavorites(this.init).subscribe((itemsData: ItemsData) => {
    //   console.log(itemsData)
    // });
    this.itemService.mine(this.init, this.selectedStatus).subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.init = itemsData.init;
      this.items = this.items.concat(items);
      this.loading = false;
      this.end = !this.init;

      console.log(this.items);
    });
  }

  loadMore() {
    console.log('load more');
  }

}
