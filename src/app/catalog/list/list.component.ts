import { Component, OnDestroy, OnInit } from '@angular/core';
import { I18nService, Item, TrackingService, UserService } from 'shield';
import { ItemService } from '../../core/item/item.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = true;
  private page: number = 1;
  public end: boolean;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.getItems();
  }

  public filterByStatus(status: string) {
    this.selectedStatus = status;
    this.page = 1;
    this.getItems();
  }

  public loadMore() {
    this.page++;
    this.getItems(true);
  }

  private getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mine(this.page, this.selectedStatus).subscribe((items: Item[]) => {
      if (this.selectedStatus === 'solds') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: items.length});
      } else {
        this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: items.length});
      }
      this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, {page_number: this.page});
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      this.end = !items.length;
    });
  }
}
