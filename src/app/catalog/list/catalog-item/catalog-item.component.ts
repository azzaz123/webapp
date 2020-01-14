import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ItemService } from '../../../core/item/item.service';
import { ItemChangeEvent } from './item-change.interface';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ReactivateModalComponent } from '../modals/reactivate-modal/reactivate-modal.component';
import { Order, Product } from '../../../core/item/item-response.interface';
import { OrderEvent } from '../selected-items/selected-product.interface';
import { DEFAULT_ERROR_MESSAGE } from '../../../core/errors/errors.service';
import { Item } from '../../../core/item/item';
import { EventService } from '../../../core/event/event.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PAYMENT_METHOD } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit {

  @Input() item: Item;
  @Input() showPublishCTA = false;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  @Output() purchaseListingFee: EventEmitter<OrderEvent> = new EventEmitter<OrderEvent>();
  public link: string;
  public selectMode = false;

  constructor(
    private modalService: NgbModal,
    public itemService: ItemService,
    private trackingService: TrackingService,
    private toastr: ToastrService,
    private eventService: EventService,
    private deviceService: DeviceDetectorService,
    @Inject('SUBDOMAIN') private subdomain: string) {
  }

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
        this.trackingService.track(TrackingService.PRODUCT_UNRESERVED, { product_id: item.id });
        this.eventService.emit(EventService.ITEM_RESERVED, item);
      });
    }
  }

  public featureItem(item: Item): void {
    this.itemService.selectedAction = 'feature';
    this.select(item);
  }

  public reactivate(item: Item) {
    this.itemService.getAvailableReactivationProducts(item.id).subscribe((product: Product) => {
      if (product.durations) {
        const orderEvent: OrderEvent = this.buildOrderEvent(item, product);
        if (this.deviceService.isMobile()) {
          this.reactivateItem(item);
        } else {
          this.openReactivateDialog(item, orderEvent);
        }
      } else {
        this.toastr.error(DEFAULT_ERROR_MESSAGE);
      }
    }, () => this.toastr.error(DEFAULT_ERROR_MESSAGE));
  }

  private buildOrderEvent(item: Item, product: Product): OrderEvent {
    const order: Order[] = [{
      item_id: item.id,
      product_id: product.durations[0].id
    }];
    return {
      order: order,
      total: +product.durations[0].market_code
    };
  }

  private openReactivateDialog(item: Item, orderEvent: OrderEvent) {
    const modalRef: NgbModalRef = this.modalService.open(ReactivateModalComponent, {
      windowClass: 'modal-standard'
    });
    modalRef.componentInstance.price = orderEvent.total;
    modalRef.componentInstance.item = item;
    modalRef.result.then((result: string) => {
      if (result === 'bump') {
        this.itemChange.emit({
          orderEvent: orderEvent,
          action: 'reactivatedWithBump'
        });
      } else {
        this.reactivateItem(item);
      }
    }, () => {
    });
  }

  public reactivateItem(item: Item) {
    this.itemService.reactivateItem(item.id).subscribe(() => {
      this.itemChange.emit({
        item,
        action: 'reactivated'
      });
    });
    appboy.logCustomEvent('ReactivateItem', { platform: 'web' });
  }

  public select(item: Item) {
    item.selected = !item.selected;
    this.itemService.selectedAction = this.itemService.selectedAction === 'feature' ? 'feature' : '';
    if (item.selected) {
      this.itemService.selectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_SELECTED, { product_id: item.id });
    } else {
      this.itemService.deselectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_UN_SELECTED, { product_id: item.id });
    }
  }

  public setSold(item: Item) {
    this.trackingService.track(TrackingService.PRODUCT_SOLD, { product_id: item.id });
    appboy.logCustomEvent('Sold', { platform: 'web' });
    fbq('track', 'CompleteRegistration', { value: item.salePrice, currency: item.currencyCode });
    this.itemChange.emit({
      item: item,
      action: 'sold'
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
      const order: Order[] = [{
        item_id: this.item.id,
        product_id: response.durations[0].id
      }];
      const orderEvent: OrderEvent = {
        order,
        total: +response.durations[0].market_code
      };
      localStorage.setItem('transactionType', 'purchaseListingFee');
      this.trackingService.track(TrackingService.PURCHASE_LISTING_FEE_CATALOG, {
        item_id: this.item.id,
        payment_method: PAYMENT_METHOD.STRIPE
      });
      this.purchaseListingFee.next(orderEvent);
    });
  }

  public openItem() {
    const event = TrackingService.PRODUCT_VIEWED;
    const params = {
      product_id: this.item.id
    };

    this.trackingService.track(event, params);
    window.open(this.link);
  }

}
