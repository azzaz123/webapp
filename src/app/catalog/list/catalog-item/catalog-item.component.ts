import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, TrackingService } from 'shield';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { ItemChangeEvent } from './item-change.interface';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();

  constructor(private modalService: NgbModal,
              private itemService: ItemService,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
  }

  public deleteItem(item: Item): void {
    this.modalService.open(ConfirmationModalComponent).result.then(() => {
      this.itemService.deleteItem(item.id).subscribe(() => {
        this.trackingService.track(TrackingService.PRODUCT_DELETED, {product_id: item.id});
        this.itemChange.emit({
          item: item,
          action: 'deleted'
        });
      });
    }, () => {
    });
  }

  public reserve(item: Item) {
    this.itemService.reserveItem(item.id, !item.reserved).subscribe(() => {
      item.reserved = !item.reserved;
      if (item.reserved) {
        this.trackingService.track(TrackingService.PRODUCT_RESERVED, {product_id: item.id});
      } else {
        this.trackingService.track(TrackingService.PRODUCT_UNRESERVED, {product_id: item.id});
      }
    });
  }

  public reactivateItem(item: Item) {
    this.itemService.reactivateItem(item.id).subscribe(() => {
      this.itemChange.emit({
        item: item,
        action: 'reactivated'
      });
    });
  }

  public select(item: Item) {
    item.selected = !item.selected;
    if (item.selected) {
      this.itemService.selectedItems.push(item.id);
      this.trackingService.track(TrackingService.PRODUCT_SELECTED, {product_id: item.id});
    } else {
      this.itemService.selectedItems = _.without(this.itemService.selectedItems, item.id);
      this.trackingService.track(TrackingService.PRODUCT_UN_SELECTED, {product_id: item.id});
    }
  }

  public setSold(item: Item) {
    
  }

}
