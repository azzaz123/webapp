import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Item } from 'shield';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { ItemChangeEvent } from './item-change.interface';
import { SoldModalComponent } from '../modals/sold-modal/sold-modal.component';
import { environment } from '../../../../environments/environment';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ReactivateModalComponent } from '../modals/reactivate-modal/reactivate-modal.component';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  public link: string;

  constructor(private modalService: NgbModal,
              public itemService: ItemService,
              private trackingService: TrackingService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.link = environment.siteUrl.replace('es', this.subdomain) + 'item/' + this.item.webSlug;
  }

  get showCheckbox() {
    return (this.itemService.selectedAction !== 'feature' && this.itemService.selectedAction !== 'reserve') ||
      (this.itemService.selectedAction === 'feature' && !this.item.featured) ||
      (this.itemService.selectedAction === 'reserve' && !this.item.reserved);
  }

  public deleteItem(item: Item): void {
    this.itemService.selectedAction = 'delete';
    this.select(item);
  }

  public reserve(item: Item) {
    if (!item.reserved) {
      this.itemService.selectedAction = 'reserve';
      this.select(item);
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
        this.trackingService.track(TrackingService.PRODUCT_UNRESERVED, {product_id: item.id});
      });
    }
  }

  public featureItem(item: Item): void {
    this.itemService.selectedAction = 'feature';
    this.select(item);
  }

  public openReactivateDialog(item: Item) {
    const modalRef: NgbModalRef = this.modalService.open(ReactivateModalComponent, {
      windowClass: 'reactivate'
    });
    modalRef.componentInstance.item = item;
    modalRef.result.then((result: string) => {
      if (result === 'bump') {
        this.itemChange.emit({
          item: item,
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
        item: item,
        action: 'reactivated'
      });
    });
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
