import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheapestProducts, ItemsData } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { Item } from 'app/core/item/item';
import { Subject } from 'rxjs';

@Component({
  selector: 'tsl-items-stats',
  templateUrl: './items-stats.component.html',
  styleUrls: ['./items-stats.component.scss'],
})
export class ItemsStatsComponent implements OnInit {
  @Input() paginate: Subject<boolean>;
  @Output() stopPagination = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  public items: Item[] = [];
  public end: boolean;
  public opens: boolean[] = [];
  public prices: CheapestProducts;

  private since: string = null;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.getItems();
    this.paginate.subscribe((event) => {
      this.getItems(true);
    });
  }

  public onOpen(index: number) {
    this.opens = this.items.map((_) => false);
    this.opens[index] = true;
  }

  private getItems(append?: boolean) {
    this.isLoading.next(true);
    if (!append) {
      this.items = [];
    }
    this.itemService.mine(this.since, 'published').subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      this.since = itemsData.since;
      this.items = append ? this.items.concat(items) : items;
      this.isLoading.next(false);
      this.end = !this.since;
      if (this.end) {
        this.stopPagination.next(true);
      }
      if (this.items.length) {
        this.getProductsFromItems();
      }
    });
  }

  private getProductsFromItems() {
    const itemsIds: string[] = this.items.map((item: Item) => item.id);
    this.itemService.getCheapestProductPrice(itemsIds).subscribe((prices: CheapestProducts) => {
      this.prices = prices;
    });
  }
}
