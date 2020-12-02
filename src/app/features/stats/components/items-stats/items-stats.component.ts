import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  CheapestProducts,
  ItemsData,
} from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { Item } from 'app/core/item/item';
import { Subject } from 'rxjs';

@Component({
  selector: 'tsl-items-stats',
  templateUrl: './items-stats.component.html',
  styleUrls: ['./items-stats.component.scss'],
})
export class ItemsStatsComponent implements OnInit {
  public items: Item[] = [];
  private init = 0;
  public end: boolean;
  public opens: boolean[] = [];
  public prices: CheapestProducts;
  @Input() paginate: Subject<boolean>;
  @Output() stopPagination = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.getItems();
    this.paginate.subscribe((event) => {
      this.getItems(true);
    });
  }

  private getItems(append?: boolean) {
    this.isLoading.next(true);
    if (!append) {
      this.items = [];
    }
    this.itemService
      .mine(this.init, 'published')
      .subscribe((itemsData: ItemsData) => {
        const items = itemsData.data;
        this.init = itemsData.init;
        this.items = append ? this.items.concat(items) : items;
        this.isLoading.next(false);
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
    this.opens = this.items.map((_) => false);
    this.opens[index] = true;
  }

  private getProductsFromItems() {
    const itemsIds: string[] = this.items.map((item: Item) => item.id);
    this.itemService
      .getCheapestProductPrice(itemsIds)
      .subscribe((prices: CheapestProducts) => {
        this.prices = prices;
      });
  }
}
