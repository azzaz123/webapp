import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Item } from '../../../../core/item/item';
import { ItemChangeEvent } from '../../../list/catalog-item/item-change.interface';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { ItemService } from '../../../../core/item/item.service';

@Component({
  selector: 'tsl-catalog-pro-item',
  templateUrl: './catalog-pro-item.component.html',
  styleUrls: ['./catalog-pro-item.component.scss']
})
export class CatalogProItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
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

}
