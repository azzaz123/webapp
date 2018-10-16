import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../core/item/item';
import { ItemService } from '../../core/item/item.service';
import { ItemCounters } from '../../core/item/item-response.interface';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';

export const showWillisCategories = {
  'GAME': 13100,
  'TV_AUDIO_CAMERAS' : 12545,
  'GAMES_CONSOLES' : 12900
};

export const showKlincCategories = {
  'COMPUTERS_ELECTRONIC' : 15000,
  'PHONES_ACCESSORIES' : 16000
};

@Component({
  selector: 'tsl-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {

  @Input() item: Item;
  @Input() user: User;
  public itemUrl: string;
  public isCarItem = false;
  public showKlincLink = false;
  public showWillisLink = false;
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

    if (this.item && this.item.categoryId === 100) {
      this.isCarItem = true;
      this.trackingService.track(TrackingService.CARFAX_CHAT_DISPLAY);
    } else {
      this.isCarItem = false;
    }

    this.showWillisLink = Object.values(showWillisCategories).includes(this.item.categoryId);
    if (this.showWillisLink) {
      this.trackingService.track(TrackingService.WILLIS_LINK_DISPLAY);
    }

    this.showKlincLink = Object.values(showKlincCategories).includes(this.item.categoryId);
    if (this.showKlincLink) {
      this.trackingService.track(TrackingService.KLINC_LINK_DISPLAY);
    }
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
        this.trackingService.track(TrackingService.CHAT_PRODUCT_RESERVED, {item_id: this.item.id});
      }
    });
  }

  public trackSoldEvent(item: Item) {
    this.trackingService.track(TrackingService.CHAT_PRODUCT_SOLD, {item_id: item.id});
    appboy.logCustomEvent('Sold', {platform: 'web'});
  }

  public clickCarfax(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.CARFAX_CHAT_TAP);
  }

  public clickWillis(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.WILLIS_LINK_TAP);
  }

  public clickKlinc(event) {
    event.stopPropagation();
    this.trackingService.track(TrackingService.KLINC_LINK_TAP);
  }
}
