import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ItemService } from '@core/item/item.service';
import { ItemChangeEvent, ITEM_CHANGE_ACTION } from '../../core/item-change.interface';
import { Order, Product } from '@core/item/item-response.interface';
import { OrderEvent } from '../selected-items/selected-product.interface';
import { DEFAULT_ERROR_MESSAGE } from '@core/errors/errors.service';
import { Item } from '@core/item/item';
import { EventService } from '@core/event/event.service';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent implements OnInit {
  @Input() item: Item;
  @Input() showPublishCTA = false;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  @Output() purchaseListingFee: EventEmitter<OrderEvent> = new EventEmitter<OrderEvent>();
  public link: string;
  public selectMode = false;
  public tooltipMessages = {
    markAsSold: $localize`:@@web_catalog_mark_as_sold_tooltip:Mark as sold`,
    markAsReserved: $localize`:@@web_catalog_mark_as_reserved_tooltip:Mark as reserved`,
    edit: $localize`:@@web_catalog_edit_tooltip:Edit`,
  };

  constructor(
    public itemService: ItemService,
    private toastService: ToastService,
    private eventService: EventService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {
    this.link = this.item.getUrl(this.subdomain);
    this.itemService.selectedItems$.subscribe(() => {
      this.selectMode = this.itemService.selectedItems.length !== 0;
    });
  }

  public reserve(item: Item) {
    if (!item.reserved) {
      this.itemService.selectedAction = 'reserve';
      this.itemService.reserveItem(item.id, true).subscribe(() => {
        item.reserved = true;
      });
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
        this.eventService.emit(EventService.ITEM_RESERVED, item);
      });
    }
  }

  public featureItem(item: Item): void {
    this.itemService.selectedAction = 'feature';
    this.select(item);
  }

  public activateItem(item: Item): void {
    this.itemChange.emit({ item, action: ITEM_CHANGE_ACTION.ACTIVATE });
  }

  public reactivate(item: Item): void {
    this.reactivateItem(item);
  }

  private reactivateItem(item: Item): void {
    this.itemService.reactivateItem(item.id).subscribe(
      () => {
        this.itemChange.emit({
          item,
          action: ITEM_CHANGE_ACTION.REACTIVATED,
        });
      },
      () => this.toastService.show({ text: DEFAULT_ERROR_MESSAGE, type: 'error' })
    );
  }

  public select(item: Item) {
    item.selected = !item.selected;
    this.itemService.selectedAction = this.itemService.selectedAction === 'feature' ? 'feature' : '';
    if (item.selected) {
      this.itemService.selectItem(item.id);
    } else {
      this.itemService.deselectItem(item.id);
    }
  }

  public setSold(item: Item) {
    fbq('track', 'CompleteRegistration', {
      value: item.salePrice,
      currency: item.currencyCode,
    });
    this.itemChange.emit({
      item: item,
      action: ITEM_CHANGE_ACTION.SOLD,
    });
    this.eventService.emit(EventService.ITEM_SOLD, item);
  }

  public showListingFee(): boolean {
    return this.item.listingFeeExpiringDate > new Date().getTime();
  }

  public listingFeeFewDays(): boolean {
    const threeDaysTime = 3 * 24 * 60 * 60 * 1000;
    return this.item.listingFeeExpiringDate - new Date().getTime() < threeDaysTime;
  }

  public publishItem(): void {
    this.itemService.getListingFeeInfo(this.item.id).subscribe((response: Product) => {
      const order: Order[] = [
        {
          item_id: this.item.id,
          product_id: response.durations[0].id,
        },
      ];
      const orderEvent: OrderEvent = {
        order,
        total: +response.durations[0].market_code,
      };
      localStorage.setItem('transactionType', 'purchaseListingFee');
      this.purchaseListingFee.next(orderEvent);
    });
  }

  public openItem() {
    window.open(this.link);
  }
}
