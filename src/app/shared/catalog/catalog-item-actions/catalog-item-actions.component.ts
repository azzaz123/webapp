import { takeWhile } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { ItemBulkResponse } from '../../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/item/item';

import { find, findIndex } from 'lodash-es';
import { AlreadyFeaturedModalComponent } from '../modals/already-featured-modal/already-featured-modal.component';
import { Router } from '@angular/router';
import { EventService } from '../../../core/event/event.service';
import { DeactivateItemsModalComponent } from './deactivate-items-modal/deactivate-items-modal.component';
import { SUBSCRIPTION_TYPES } from '../../../core/subscriptions/subscriptions.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ListingLimitService } from '@core/subscriptions/listing-limit/listing-limit.service';

@Component({
  selector: 'tsl-catalog-item-actions',
  templateUrl: './catalog-item-actions.component.html',
  styleUrls: ['./catalog-item-actions.component.scss'],
})
export class CatalogItemActionsComponent implements OnInit {
  @Input() selectedStatus: string;
  @Input() items: Item[];
  @Input() active: boolean;
  @Output() public getCounters: EventEmitter<any> = new EventEmitter();

  constructor(
    public itemService: ItemService,
    private modalService: NgbModal,
    private errorService: ErrorsService,
    private router: Router,
    private eventService: EventService,
    private listingLimitService: ListingLimitService
  ) {}

  ngOnInit() {
    this.resetSelectedItems();
  }

  public deactivate() {
    this.modalService.open(DeactivateItemsModalComponent).result.then(() => {
      this.itemService
        .bulkSetDeactivate()
        .pipe(
          takeWhile(() => {
            this.eventService.emit('itemChanged');
            return this.active;
          })
        )
        .subscribe(() => this.getCounters.emit());
    });
  }

  public activate() {
    this.itemService
      .bulkSetActivate()
      .pipe(
        takeWhile(() => {
          return this.active;
        })
      )
      .subscribe((resp: any) => {
        this.getCounters.emit();
        this.eventService.emit('itemChanged');
        if (resp.status === 406) {
          this.listingLimitService.showModal(null, SUBSCRIPTION_TYPES.carDealer);
        }
      });
  }

  public delete(deleteItemsModal: any) {
    this.modalService.open(deleteItemsModal).result.then(() => {
      this.itemService
        .bulkDelete(this.selectedStatus)
        .pipe(
          takeWhile(() => {
            return this.active;
          })
        )
        .subscribe((response: ItemBulkResponse) => {
          this.getCounters.emit();
          this.eventService.emit('itemChanged');
          response.updatedIds.forEach((id: string) => {
            let index: number = findIndex(this.items, { id: id });
            this.items.splice(index, 1);
            this.getCounters.emit();
          });
          if (response.failedIds.length) {
            this.errorService.i18nError(TRANSLATION_KEY.BULK_DELETE_ERROR);
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
      modalRef.result.then(
        () => {
          modalRef = null;
          this.router.navigate(['pro/catalog/checkout']);
        },
        () => {}
      );
    }
  }

  private itemIsBumped(): boolean {
    let isBumped = false;
    this.itemService.selectedItems.forEach((id: string) => {
      let selectedItem: Item = find(this.items, { id: id });
      if (selectedItem && selectedItem.purchases) {
        isBumped = true;
      }
    });
    return isBumped;
  }

  private resetSelectedItems(): void {
    this.itemService.selectedItems = [];
  }

  public selectAll() {
    this.items.forEach((item) => {
      this.itemService.selectItem(item.id);
      item.selected = true;
    });
  }
}
