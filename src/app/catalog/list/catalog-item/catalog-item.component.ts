import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, TrackingService } from 'shield';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { ItemChangeEvent } from './item-change.interface';
import * as _ from 'lodash';
import { SoldModalComponent } from '../modals/sold-modal/sold-modal.component';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();

  constructor(private modalService: NgbModal,
              public itemService: ItemService,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
  }

  public deleteItem(item: Item): void {
    this.select(item);
  }

  public reserve(item: Item) {
    this.select(item);
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
    const modalRef: NgbModalRef = this.modalService.open(SoldModalComponent, {windowClass: 'sold'});
    modalRef.componentInstance.item = item;
    modalRef.result.then(() => {
      item.sold = true;
      this.trackingService.track(TrackingService.PRODUCT_SOLD, {product_id: item.id});
      this.itemChange.emit({
        item: item,
        action: 'sold'
      });
    }, () => {
    });
  }

}
