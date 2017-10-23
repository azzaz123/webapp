import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FinancialCard,
  I18nService,
  Item,
  ItemBulkResponse,
  PaymentService,
  TrackingService,
  ErrorsService
} from 'shield';
import { ItemService } from '../../core/item/item.service';
import { ItemChangeEvent } from './catalog-item/item-change.interface';
import * as _ from 'lodash';
import { ItemsData, Order } from '../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Response } from '@angular/http';

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = true;
  private init: number = 0;
  public end: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private i18n: I18nService,
              private paymentService: PaymentService,
              private errorService: ErrorsService) {
  }

  ngOnInit() {
    this.getItems();
    setTimeout(() => {
      this.route.queryParams.subscribe((params: any) => {
        if (params && params.code) {
          const modalRef: NgbModalRef = this.modalService.open(BumpConfirmationModalComponent, {windowClass: 'review'});
          modalRef.componentInstance.code = params.code;
        }
      });
    });
  }

  public filterByStatus(status: string) {
    if (status !== this.selectedStatus) {
      this.selectedStatus = status;
      this.init = 0;
      this.getItems();
    }
  }

  public loadMore() {
    this.getItems(true);
  }

  private getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mine(this.init, this.selectedStatus).subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      if (this.selectedStatus === 'sold') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: items.length});
      } else if (this.selectedStatus === 'published') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: items.length});
      }
      this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, {init: this.init});
      this.init = itemsData.init;
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      this.end = !this.init;
    });
  }

  public itemChanged($event: ItemChangeEvent) {
    const index: number = _.findIndex(this.items, {'_id': $event.item.id});
    this.items.splice(index, 1);
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map((item: Item) => {
      item.selected = false;
    });
    this.itemService.selectedAction = null;
  }

  public onAction($event?: any) {
    if (this.itemService.selectedAction === 'delete') {
      this.delete();
    } else if (this.itemService.selectedAction === 'reserve') {
      this.reserve();
    } else if (this.itemService.selectedAction === 'feature') {
      this.feature($event);
    }
  }

  public delete() {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.type = 1;
    modalRef.result.then(() => {
      this.itemService.bulkDelete('active').subscribe((response: ItemBulkResponse) => {
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_DELETED, {product_ids: response.updatedIds.join(', ')});
        response.updatedIds.forEach((id: string) => {
          const index: number = _.findIndex(this.items, {'id': id});
          this.items.splice(index, 1);
        });
        if (response.failedIds.length) {
          this.toastr.error(this.i18n.getTranslations('bulkDeleteError'));
        }
      });
    }, () => {
    });
  }

  public reserve() {
    this.itemService.bulkReserve().subscribe((response: ItemBulkResponse) => {
      this.deselect();
      this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_ids: response.updatedIds.join(', ')});
      response.updatedIds.forEach((id: string) => {
        const index: number = _.findIndex(this.items, {'id': id});
        if (this.items[index]) {
          this.items[index].reserved = true;
        }
      });
      if (response.failedIds.length) {
        this.toastr.error(this.i18n.getTranslations('bulkReserveError'));
      }
    });
  }

  public feature(order: Order[]) {
    const orderId: string = UUID.UUID();
    this.itemService.purchaseProducts(order, orderId).subscribe((failedProducts: string[]) => {
      this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
        console.log('We have card!', financialCard);
        this.sabadellSubmit.emit(orderId); // TODO: remove this and open credit card dialog passing financialCard
      }, () => {
        this.sabadellSubmit.emit(orderId);
      });
    }, (error: Response) => {
      this.errorService.show(error);
    });
  }
}
