import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../core/item/item';
import { ItemService } from '../../core/item/item.service';
import { ItemCounters } from '../../core/item/item-response.interface';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {

  @Input() item: Item;
  @Input() user: User;
  public itemUrl: string;
  private active = true;
  private allowReserve: boolean;
  private myUserId: string;

  constructor(private itemService: ItemService,
              private userService: UserService,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      (user: User) => {
        this.myUserId = user.id;
      });
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

  public prevent($event: Event, stop?: boolean) {
    if (this.itemUrl === '#' || stop) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  public canEdit() {
    return ((this.item.owner === this.myUserId) && !this.item.sold);
  }

  public toggleReserve() {
    this.itemService.reserveItem(this.item.id, !this.item.reserved).subscribe(() => {
      this.item.reserved = !this.item.reserved;
      if (this.item.reserved) {
        this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {product_id: this.item.id});
      }
    });
  }

  public trackSoldEvent(item: Item) {
    this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {product_id: item.id});
  }
}
