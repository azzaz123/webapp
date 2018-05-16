import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemChangeEvent } from '../../../catalog/list/catalog-item/item-change.interface';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ItemService } from '../../../core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';

@Component({
  selector: 'tsl-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  public link: string;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private errorService: ErrorsService) { }

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
    this.trackingService.track(TrackingService.PRODUCT_SOLD, {product_id: item.id});
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
      });
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
      });
    }
  }

  public cancelAutorenew(item: Item, cancelAutorenewModal: any) {
    this.modalService.open(cancelAutorenewModal).result.then(() => {
      this.itemService.cancelAutorenew(item.id).subscribe((resp: any) => {
        if (resp.status !== 200) {
          this.errorService.show(resp);
        }
      });
    });
  }

}
