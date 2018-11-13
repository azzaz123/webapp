import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheapestProducts, ItemsData } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { Item } from '../../core/item/item';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'tsl-items-stats',
  templateUrl: './items-stats.component.html',
  styleUrls: ['./items-stats.component.scss']
})
export class ItemsStatsComponent implements OnInit {

  public items: Item[] = [];
  public loading = true;
  private init = 0;
  public end: boolean;
  public opens: boolean[] = [];
  public prices: CheapestProducts;
  @Input() onPaginate: Subject<boolean>;
  @Output() stopPagination = new EventEmitter <boolean>();

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
    this.onPaginate.subscribe(event => {
      this.getItems(true);
    });
  }

  private getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mine(this.init, 'published').subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.init = itemsData.init;
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      this.end = !this.init;
      if (this.end) {
        this.stopPagination.next(true);
      }
      if (this.items.length) {
        this.getProductsFromItems();
      }
    });
  }

  public onOpen(index: number) {
    this.opens = this.items.map(_ => false);
    this.opens[index] = true;
  }

  private getProductsFromItems() {
    const itemsIds: string[] = this.items.map((item: Item) => item.id);
    this.itemService.getCheapestProductPrice(itemsIds).subscribe((prices: CheapestProducts) => {
      this.prices = prices;
    });
  }

}
