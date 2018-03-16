import { Component, Inject, Input, OnInit,  OnChanges, OnDestroy } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { ItemService } from '../../core/item/item.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Item, ItemCounters, User } from 'shield';

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

  prevent($event: Event) {
    const el = $event.target as Element;
    if (this.itemUrl === '#' ||
        el.classList.contains('btn-reserve') ||
        el.classList.contains('btn-sold')) {
      $event.preventDefault();
    }
  }

  stopPropagation($event: Event) {
    $event.stopPropagation();
  }

  isItemOwner() {
    return (this.item.owner === this.myUserId);
  }

  canEdit() {
    return (this.isItemOwner() && !this.item.sold);
  }

  public toggleReserve(item: Item) {
    this.itemService.reserveItem(item.id, !item.reserved).subscribe(() => {
      item.reserved = !item.reserved;
      if (item.reserved) {
        this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {product_id: item.id});
      }
    });
  }
}
