import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, TrackingService } from 'shield';
import { DeleteItemComponent } from '../modals/delete-item/delete-item.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { ItemChangeEvent } from './item-change.interface';


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
              private trackingService: TrackingService) { }

  ngOnInit() {
  }

  public deleteItem(item: Item): void {
    this.modalService.open(DeleteItemComponent).result.then(() => {
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

}
