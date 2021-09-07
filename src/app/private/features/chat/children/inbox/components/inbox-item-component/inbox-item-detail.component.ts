import { Component, Input, OnInit } from '@angular/core';
import { ItemCounters } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { InboxItem } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-inbox-item-detail',
  templateUrl: './inbox-item-detail.component.html',
  styleUrls: ['./inbox-item-detail.component.scss'],
})
export class InboxItemDetailComponent implements OnInit {
  @Input() item: InboxItem;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    if (this.item.price !== undefined && (this.item.views === undefined || this.item.favorites === undefined)) {
      this.itemService.getCounters(this.item.id).subscribe((counters: ItemCounters) => {
        this.item.views = counters.views;
        this.item.favorites = counters.favorites;
      });
    }
  }

  public canEdit() {
    return this.item.isMine && !this.item.sold;
  }

  public isMine() {
    return this.item.isMine;
  }

  public prevent($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  get itemImageUrl(): String {
    return this.item.mainImage.urls_by_size.small.replace('http://', 'https://');
  }

  public toggleReserve(e: Event) {
    this.prevent(e);
    this.itemService.reserveItem(this.item.id, !this.item.reserved).subscribe(() => {
      this.item.reserved = !this.item.reserved;
    });
  }

  public trackSoldEvent(item: InboxItem) {
    fbq('track', 'CompleteRegistration', {
      value: item.price.amount,
      currency: item.price.currency,
    });
  }
}
