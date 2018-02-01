import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Item, ItemCounters, ItemService, ITEM_BASE_PATH } from 'shield';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnChanges, OnDestroy {

  @Input() item: Item;
  public itemUrl: string;
  private active = true;

  constructor(private itemService: ItemService) {
  }

  ngOnChanges(changes?: any) {
    if (this.item.salePrice && (this.item.views === undefined || this.item.favorites === undefined)) {
      this.itemService.getCounters(this.item.id).takeWhile(() => {
        return this.active;
      }).subscribe((counters: ItemCounters) => {
        this.item.views = counters.views;
        this.item.favorites = counters.favorites;
      });
    }
    this.itemUrl = this.item.webSlug ? this.item.webLink.replace(ITEM_BASE_PATH, environment.siteUrl + 'item/') : '#';
  }

  ngOnDestroy() {
    this.active = false;
  }

  prevent($event: Event) {
    if (this.itemUrl === '#') {
      $event.preventDefault();
    }
  }

}
