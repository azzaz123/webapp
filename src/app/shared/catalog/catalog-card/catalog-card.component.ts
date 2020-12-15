import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../../core/item/item';

import { TrackingService } from '../../../core/tracking/tracking.service';
import { ItemService } from '../../../core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { ItemChangeEvent } from '@features/catalog/core/item-change.interface';

@Component({
  selector: 'tsl-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss'],
})
export class CatalogCardComponent implements OnInit {
  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<
    ItemChangeEvent
  >();
  @Output() bumpCancel: EventEmitter<any> = new EventEmitter<any>();
  public link: string;
  public bumpName: string;

  constructor(
    public itemService: ItemService,
    private trackingService: TrackingService,
    private modalService: NgbModal,
    private errorService: ErrorsService,
    private i18n: I18nService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    if (this.item.purchases) {
      this.bumpName = this.setBumpName();
    }
  }

  public select(item: Item) {
    item.selected = !item.selected;
    if (item.selected) {
      this.itemService.selectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_SELECTED, {
        product_id: item.id,
      });
    } else {
      this.itemService.deselectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_UN_SELECTED, {
        product_id: item.id,
      });
    }
  }

  public setSold(item: Item) {
    this.trackingService.track(TrackingService.PRODUCT_SOLD, {
      product_id: item.id,
    });
    fbq('track', 'CompleteRegistration', {
      value: item.salePrice,
      currency: item.currencyCode,
    });
    appboy.logCustomEvent('Sold', { platform: 'web' });
    this.eventService.emit('itemChanged');
    this.itemChange.emit({
      item: item,
      action: 'sold',
    });
    this.eventService.emit(EventService.ITEM_SOLD, item);
  }

  public reserve(item: Item) {
    if (!item.reserved) {
      this.itemService.selectedAction = 'reserve';
      this.itemService.reserveItem(item.id, true).subscribe(() => {
        item.reserved = true;
        this.eventService.emit(EventService.ITEM_RESERVED, item);
      });
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
        this.eventService.emit(EventService.ITEM_RESERVED, item);
      });
    }
  }

  public cancelAutorenew(item: Item, cancelAutorenewModal: any) {
    this.modalService.open(cancelAutorenewModal).result.then(() => {
      this.itemService.cancelAutorenew(item.id).subscribe(
        () => this.bumpCancel.emit({ item }),
        (error: HttpErrorResponse) => this.errorService.show(error)
      );
    });
  }

  private setBumpName(): string {
    const bumpType =
      this.item.purchases.bump_type || this.item.purchases.scheduled_bump_type;
    return this.i18n.getTranslations(bumpType);
  }
}
