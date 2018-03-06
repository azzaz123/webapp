import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FinancialCard, Item, ItemBulkResponse, PaymentService } from 'shield';
import { ItemService } from '../../core/item/item.service';
import { ItemChangeEvent } from './catalog-item/item-change.interface';
import * as _ from 'lodash';
import {ItemsData, Order, Product} from '../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Response } from '@angular/http';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';
import { OrderEvent } from './selected-items/selected-product.interface';
import { UploadConfirmationModalComponent } from './modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { UserStatsResponse } from '../../core/user/user-stats.interface';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public items: Item[] = [];
  public selectedStatus: string = 'published';
  public loading: boolean = true;
  private init: number = 0;
  public end: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public scrollTop: number;
  private uploadModalRef: NgbModalRef;
  private active: boolean = true;
  private firstItemLoad = true;
  public numberOfProducts: number;
  public isUrgent: boolean = false;
  private isRedirect: boolean = false;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private paymentService: PaymentService,
              private errorService: ErrorsService,
              private router: Router, 
              private userService: UserService) {
  }

  ngOnInit() {
    this.getItems();
    this.getNumberOfProducts();
    setTimeout(() => {
      this.router.events.takeWhile(() => this.active).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        this.scrollTop = 0;
        this.init = 0;
        this.end = false;
        this.getItems();
      });
      this.route.params.subscribe((params: any) => {
        if(!params.urgent) {
          this.setRedirectToTPV(false);
        }
        if (params && params.code) {
          const modalRef: NgbModalRef = this.modalService.open(BumpConfirmationModalComponent, {
            windowClass: 'bump-confirm',
            backdrop: 'static'
          });
          modalRef.componentInstance.code = params.code;
          modalRef.result.then(() => {
            this.router.navigate(['catalog/list']);
          }, () => {
          });
        }
        if (params && params.created) {
          this.uploadModalRef = this.modalService.open(UploadConfirmationModalComponent, {
            windowClass: 'upload',
          });
          this.uploadModalRef.result.then((orderEvent: OrderEvent) => {
            this.feature(orderEvent);
          }, () => {
          });
        } else if (params && params.urgent) {
            this.isUrgent = true;
            this.isRedirect = !this.getRedirectToTPV();
            if (!this.getRedirectToTPV()) {
              setTimeout(() => {
                this.getUrgentPrice(params.itemId);
              }, 3000);
            }
        } else if (params && params.updated) {
            this.errorService.i18nSuccess('itemUpdated');
        }
      });
    });
  }

  private restoreSelectedItems() {
    this.itemService.selectedItems.forEach((itemId: string) => {
      this.itemService.selectedItems$.next({
        id: itemId,
        action: 'selected'
      });
    });
  }

  ngOnDestroy() {
    this.active = false;
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
      if (this.uploadModalRef) {
        this.uploadModalRef.componentInstance.item = this.items[0];
        this.uploadModalRef.componentInstance.urgentPrice();
      }
      if (this.firstItemLoad) {
        setTimeout(() => {
          this.restoreSelectedItems();
        });
      }
      this.firstItemLoad = false;
    });
  }

  public itemChanged($event: ItemChangeEvent) {
    if ($event.action === 'reactivatedWithBump') {
      this.feature($event.orderEvent);
    } else {
      const index: number = _.findIndex(this.items, {'_id': $event.item.id});
      this.items.splice(index, 1);
    }
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
          this.errorService.i18nError('bulkDeleteError');
        } else {
          this.getNumberOfProducts();
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
        this.errorService.i18nError('bulkReserveError');
      }
    });
  }

  public feature(orderEvent: OrderEvent) {
    const orderId: string = UUID.UUID();
    this.itemService.purchaseProducts(orderEvent.order, orderId).subscribe((failedProducts: string[]) => {
      if (failedProducts && failedProducts.length) {
        this.errorService.i18nError('bumpError');
      } else {
        this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
          this.chooseCreditCard(orderId, orderEvent.total, financialCard);
        }, () => {
          this.setRedirectToTPV(true);
          this.sabadellSubmit.emit(orderId);
        });
      }
    }, (error: Response) => {
      this.deselect();
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

  private chooseCreditCard(orderId: string, total: number, financialCard: FinancialCard) {
    const modalRef: NgbModalRef = this.modalService.open(CreditCardModalComponent, {windowClass: 'credit-card'});
    modalRef.componentInstance.financialCard = financialCard;
    modalRef.componentInstance.total = total;
    this.trackingService.track(TrackingService.FEATURED_PURCHASE_FINAL, {select_card: financialCard.id});
    modalRef.result.then((result: string) => {
      if (result === 'new') {
        this.setRedirectToTPV(true);
        this.sabadellSubmit.emit(orderId);
      } else {
        this.paymentService.pay(orderId).subscribe(() => {
          this.deselect();
          setTimeout(() => {
            this.router.navigate(['catalog/list', {code: 200}]);
          }, 1000);
        }, () => {
          this.deselect();
          setTimeout(() => {
            this.router.navigate(['catalog/list', {code: -1}]);
          }, 1000);
        });
      }
    }, () => {
      this.deselect();
    })
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.numberOfProducts = userStats.counters.publish;
    });
  }

  private getUrgentPrice(itemId: string): void {
    this.itemService.getUrgentProducts(itemId).subscribe((product: Product) => {
      const order: Order[] = [{
        item_id: itemId,
        product_id: product.durations[0].id
      }];
      const orderEvent: OrderEvent = {
        order: order,
        total: +product.durations[0].market_code
      };
      this.feature(orderEvent);
    });
  }

  private setRedirectToTPV(state: boolean): void {
    localStorage.setItem('redirectToTPV', state.toString());
    this.isRedirect = state;
  }

  private getRedirectToTPV(): boolean {
    return localStorage.getItem('redirectToTPV') === 'true';
  }

}
