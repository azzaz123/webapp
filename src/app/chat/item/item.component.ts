import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Item, ItemCounters, ItemService } from 'shield';

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnChanges, OnDestroy {

  @Input() item: Item;
  private active = true;

  constructor(private itemService: ItemService) {
  }

  ngOnChanges(changes?: any) {
    if (this.item.views === undefined || this.item.favorites === undefined) {
      this.itemService.getCounters(this.item.id).takeWhile(() => {
        return this.active;
      }).subscribe((counters: ItemCounters) => {
        this.item.views = counters.views;
        this.item.favorites = counters.favorites;
      });
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

}
