import { Component, Inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Item, ItemCounters, ItemService } from 'shield';

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnChanges, OnDestroy {

  @Input() item: Item;
  public itemUrl: string;
  private active = true;

  constructor(private itemService: ItemService,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnChanges(changes?: any) {
    if (this.item.salePrice !== undefined && (this.item.views === undefined || this.item.favorites === undefined)) {
      this.itemService.getCounters(this.item.id).takeWhile(() => {
        return this.active;
      }).subscribe((counters: ItemCounters) => {
        this.item.views = counters.views;
        this.item.favorites = counters.favorites;
      });
    }
    this.itemUrl = this.item.webSlug ? this.item.getUrl(this.subdomain) : '#';
  }

  ngOnDestroy() {
    this.active = false;
  }

  prevent($event: Event) {
    if (this.itemUrl === '#') {
      $event.preventDefault();
    }
  }

  editItem($event: Event) {
    $event.stopPropagation();
  }
}
