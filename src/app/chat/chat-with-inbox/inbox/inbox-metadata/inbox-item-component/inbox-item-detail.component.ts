import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { InboxItem } from '../../../../model/inbox-item';
import { ItemService } from '../../../../../core/item/item.service';
import { TrackingService } from '../../../../../core/tracking/tracking.service';
import { ItemCounters } from '../../../../../core/item/item-response.interface';

@Component({
  selector: 'tsl-inbox-item-detail',
  templateUrl: './inbox-item-detail.component.html',
  styleUrls: ['./inbox-item-detail.component.scss']
})
export class InboxItemDetailComponent implements OnInit, OnChanges, OnDestroy {

  @Input() item: InboxItem;

  constructor(private itemService: ItemService,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
      if (this.item.price !== undefined && (this.item.views === undefined || this.item.favorites === undefined)) {
        this.itemService.getCounters(this.item.id).subscribe((counters: ItemCounters) => {
          this.item.views = counters.views;
          this.item.favorites = counters.favorites;
        });
      }
  }

  ngOnChanges(changes?: any) {  }

  ngOnDestroy() {  }

  public canEdit() {
    return ((this.item.isMine) && !this.item.sold);
  }

  public isMine() {
    return this.item.isMine;
  }

  public prevent($event: Event, stop?: boolean) {
    if (this.item.itemUrl === undefined || this.item.itemUrl === '#' || stop) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  get itemImageUrl(): String {
    return this.item.mainImage.urls_by_size.small.replace('http://', 'https://');
  }

  public toggleReserve() {
    this.itemService.reserveItem(this.item.id, !this.item.reserved).subscribe(() => {
      this.item.reserved = !this.item.reserved;
      if (this.item.reserved) {
        this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {item_id: this.item.id});
      }
    });
  }

  public trackSoldEvent(item: InboxItem) {
    this.trackingService.track(TrackingService.CHAT_PRODUCT_SOLD, {item_id: item.id});
    fbq('track', 'CompleteRegistration', { value: item.price.amount, currency: item.price.currency});
    appboy.logCustomEvent('Sold', {platform: 'web'});
  }
}
