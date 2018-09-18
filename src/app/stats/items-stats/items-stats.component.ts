import { Component, OnInit } from '@angular/core';
import { ItemsData } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';
import { Item } from '../../core/item/item';

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

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
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
    });
  }

  public onOpen(index: number) {
    this.opens = this.items.map(_ => false);
    this.opens[index] = true;
  }

}
