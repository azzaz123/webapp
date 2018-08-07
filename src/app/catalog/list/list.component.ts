import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemChangeEvent } from './catalog-item/item-change.interface';
import * as _ from 'lodash';
import { ItemBulkResponse, ItemsData, Order, Product } from '../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Response } from '@angular/http';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';
import { OrderEvent } from './selected-items/selected-product.interface';
import { UploadConfirmationModalComponent } from './modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { UserStatsResponse, Counters } from '../../core/user/user-stats.interface';
import { BumpTutorialComponent } from '../checkout/bump-tutorial/bump-tutorial.component';
import { Item } from '../../core/item/item';
import { PaymentService } from '../../core/payments/payment.service';
import { FinancialCard, CreditInfo } from '../../core/payments/payment.interface';
import { UrgentConfirmationModalComponent } from './modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { EventService } from '../../core/event/event.service';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { PerksModel } from '../../core/payments/payment.model';

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public items: Item[] = [];
  public selectedStatus = 'published';
  public loading = true;
  private init = 0;
  public end: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public scrollTop: number;
  private uploadModalRef: NgbModalRef;
  private active = true;
  private firstItemLoad = true;
  public isUrgent = false;
  public numberOfProducts: number;
  public isRedirect = false;
  private counters: Counters;

  @ViewChild(ItemSoldDirective) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent) bumpTutorial: BumpTutorialComponent;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private paymentService: PaymentService,
              private errorService: ErrorsService,
              private router: Router,
              private userService: UserService,
              private eventService: EventService) {
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
        if (!params.urgent) {
          this.setRedirectToTPV(false);
        }
        if (params && params.code) {
          const modals = {
            urgent: {
              component: UrgentConfirmationModalComponent,
              windowClass: 'urgent-confirm',
            },
            bump: {
              component: BumpConfirmationModalComponent,
              windowClass: 'bump-confirm'
            }
          };
          const modalType = localStorage.getItem('transactionType');
          const modal = modalType && modals[modalType] ? modals[modalType] : modals.bump;

          if (modalType === 'wallapack') {
            this.router.navigate(['wallacoins', { code: params.code }]);
            return;
          }
          if (localStorage.getItem('transactionSpent')) {
            this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
              const remainingCredit: number = creditInfo.credit - +localStorage.getItem('transactionSpent');
              this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED, remainingCredit);
            });
          }

          let modalRef: NgbModalRef = this.modalService.open(modal.component, {
            windowClass: modal.windowClass,
            backdrop: 'static'
          });
          modalRef.componentInstance.code = params.code;
          modalRef.componentInstance.creditUsed = modalType === 'bumpWithCredits';
          modalRef.componentInstance.spent = localStorage.getItem('transactionSpent');
          modalRef.result.then(() => {
            modalRef = null;
            localStorage.removeItem('transactionType');
            localStorage.removeItem('transactionSpent');
            this.router.navigate(['catalog/list']);
          }, () => {
            modalRef = null;
            localStorage.removeItem('transactionType');
            localStorage.removeItem('transactionSpent');
            this.router.navigate(['wallacoins']);
          });
        }
        if (params && params.created) {
          this.uploadModalRef = this.modalService.open(UploadConfirmationModalComponent, {
            windowClass: 'upload',
          });
          this.uploadModalRef.result.then((orderEvent: OrderEvent) => {
            this.uploadModalRef = null;
            if (orderEvent) {
              this.isUrgent = true;
              this.isRedirect = !this.getRedirectToTPV();
              this.feature(orderEvent);
            }
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
        } else if (params && params.createdOnHold) {
          this.errorService.i18nError('productCreated', ' ¡Ojo! De acuerdo con tu plan no puedes activar más productos. Contacta con ventas.motor@wallapop.com si quieres aumentar tu plan o bien desactiva otro producto para poder activar este.');
        } else if (params && params.sold && params.itemId) {
          this.itemService.get(params.itemId).subscribe((item: Item) => {
            this.soldButton.item = item;
            this.soldButton.onClick();
            this.soldButton.callback.subscribe(() => {
              this.itemChanged({
                item: item,
                action: 'sold'
              });
              this.eventService.emit(EventService.ITEM_SOLD, item);
            });
          });
        } else if (params && params.alreadyFeatured) {
          this.errorService.i18nError('alreadyFeatured');
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
      this.getNumberOfProducts();
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
        this.uploadModalRef.componentInstance.trackUploaded();
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
    } else if ($event.action === 'reactivated') {
      const index: number = _.findIndex(this.items, {'_id': $event.item.id});
      this.items[index].flags.expired = false;
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
          this.eventService.emit(EventService.ITEM_RESERVED, this.items[index]);
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
      if (result === undefined) {
        this.isUrgent = false;
        localStorage.removeItem('transactionType');
        this.isRedirect = !this.getRedirectToTPV();
        this.deselect();
        setTimeout(() => {
          this.router.navigate(['catalog/list']);
        }, 1000);
      } else if (result === 'new') {
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
    });
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
    });
  }

  private setNumberOfProducts() {
    if (this.selectedStatus === 'sold') {
      this.numberOfProducts = this.counters.sold;
    } else if (this.selectedStatus === 'published') {
      this.numberOfProducts = this.counters.publish;
    }
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
