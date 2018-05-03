import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemChangeEvent } from '../../../catalog/list/catalog-item/item-change.interface';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ItemService } from '../../../core/item/item.service';
import { OrderEvent } from '../../../catalog/list/selected-items/selected-product.interface';

@Component({
  selector: 'tsl-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  @Output() onAction: EventEmitter<OrderEvent> = new EventEmitter();
  public link: string;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService) { }

  ngOnInit() {
  }

  public select(item: Item) {
    item.selected = !item.selected;
    if (item.selected) {
      this.itemService.selectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_SELECTED, {product_id: item.id});
    } else {
      this.itemService.deselectItem(item.id);
      this.trackingService.track(TrackingService.PRODUCT_UN_SELECTED, {product_id: item.id});
    }
  }

  public setSold(item: Item) {
    this.trackingService.track(TrackingService.PRODUCT_SOLD, { product_id: item.id });
    this.itemChange.emit({
      item: item,
      action: 'sold'
    });
  }

  public reserve(item: Item) {
    if (!item.reserved) {
      this.itemService.selectedAction = 'reserve';
      this.itemService.reserveItem(item.id, true).subscribe(() => {
        item.reserved = true;
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_id: item.id});
      });
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
        this.trackingService.track(TrackingService.PRODUCT_UNRESERVED, {product_id: item.id});
      });
    }
  }

  public cancelFeature(item: Item): void {
    this.itemService.cancelFeature(item);
  }

}
