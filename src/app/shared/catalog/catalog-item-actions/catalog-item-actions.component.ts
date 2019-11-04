import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ItemBulkResponse } from '../../../core/item/item-response.interface';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/item/item';

import { find, findIndex } from 'lodash-es';
import { TooManyItemsModalComponent } from '../modals/too-many-items-modal/too-many-items-modal.component';
import { AlreadyFeaturedModalComponent } from '../modals/already-featured-modal/already-featured-modal.component';
import { Router } from '@angular/router';
import { EventService } from '../../../core/event/event.service';
import { ActivateItemsModalComponent } from './activate-items-modal/activate-items-modal.component';
import { DeactivateItemsModalComponent } from './deactivate-items-modal/deactivate-items-modal.component';

@Component({
  selector:    'tsl-catalog-item-actions',
  templateUrl: './catalog-item-actions.component.html',
  styleUrls:   ['./catalog-item-actions.component.scss']
})
export class CatalogItemActionsComponent implements OnInit {

  @Input() selectedStatus: string;
  @Input() items: Item[];
  @Input() active: boolean;
  @Output() public getCounters: EventEmitter<any> = new EventEmitter();

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private i18n: I18nService,
              private router: Router,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.resetSelectedItems();
  }

  public deactivate() {
    this.modalService.open(DeactivateItemsModalComponent).result.then(() => {
      this.itemService.bulkSetDeactivate().takeWhile(() => {
        this.trackingService.track(TrackingService.MYCATALOG_PRO_MODAL_DEACTIVATE);
        this.eventService.emit('itemChanged');
        return this.active;
      }).subscribe(() => this.getCounters.emit());
    });
  }

  public activate() {
    this.modalService.open(ActivateItemsModalComponent).result.then(() => {
      this.itemService.bulkSetActivate().takeWhile(() => {
        return this.active;
      }).subscribe((resp: any) => {
        this.getCounters.emit();
        this.eventService.emit('itemChanged');
        if (resp.status === 406) {
          const modalRef: NgbModalRef = this.modalService.open(TooManyItemsModalComponent, {
            windowClass: 'bump'
          });
          modalRef.componentInstance.type = '3';
          modalRef.result.then(() => {}, () => {
          });
        }
      });
    });
  }

  public delete(deleteItemsModal: any) {
    this.modalService.open(deleteItemsModal).result.then(() => {
      this.itemService.bulkDelete(this.selectedStatus).takeWhile(() => {
        return this.active;
      }).subscribe((response: ItemBulkResponse) => {
        this.getCounters.emit();
        this.eventService.emit('itemChanged');
        response.updatedIds.forEach((id: string) => {
          let index: number = findIndex(this.items, {'id': id});
          this.items.splice(index, 1);
          this.getCounters.emit();
        });
        if (response.failedIds.length) {
          this.toastr.error(this.i18n.getTranslations('bulkDeleteError'));
        }
      });
    });
  }

  public deselect(): void {
    this.itemService.deselectItems();
  }

  public feature(): void {
    if (!this.itemIsBumped()) {
      this.router.navigate(['pro/catalog/checkout']);
    } else {
      let modalRef: NgbModalRef = this.modalService.open(AlreadyFeaturedModalComponent, {
        windowClass: 'bump',
      });
      modalRef.result.then(() => {
        modalRef = null;
        this.router.navigate(['pro/catalog/checkout']);
      }, () => {
      });
    }
  }

  private itemIsBumped(): boolean {
    let isBumped = false;
    this.itemService.selectedItems.forEach((id: string) => {
      let selectedItem: Item = find(this.items, {'id': id});
      if (selectedItem && selectedItem.purchases) {
        isBumped = true;
      }
    });
    return isBumped;
  }

  private resetSelectedItems(): void {
    this.itemService.selectedItems = [];
  }

}
