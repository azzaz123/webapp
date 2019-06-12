import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { ProUrgentConfirmationModalComponent } from './modals/pro-urgent-confirmation-modal/pro-urgent-confirmation-modal.component';
import { ProBumpConfirmationModalComponent } from './modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { Item } from '../../core/item/item';
import { Counters, UserStatsResponse } from '../../core/user/user-stats.interface';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { EventService } from '../../core/event/event.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ItemService } from '../../core/item/item.service';
import { PaymentService } from '../../core/payments/payment.service';
import { OrderEvent } from '../../catalog/list/selected-items/selected-product.interface';
import { UploadConfirmationModalComponent } from '../../catalog/list/modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { ItemChangeEvent } from '../../catalog/list/catalog-item/item-change.interface';
import { FinancialCard } from '../../core/payments/payment.interface';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';
import { Order, Product } from '../../core/item/item-response.interface';
import { StripeService } from '../../core/stripe/stripe.service';

@Component({
  selector: 'tsl-catalog-pro-list',
  templateUrl: './catalog-pro-list.component.html',
  styleUrls: ['./catalog-pro-list.component.scss']
})
export class CatalogProListComponent implements OnInit {

  public items: Item[] = [];
  public loading = true;
  public end: boolean;
  public isUrgent = false;
  public isRedirect = false;
  public orderBy: any[];
  public selectedStatus = 'active';
  public sortBy = 'date_desc';
  public counters: Counters;
  private term: string;
  private page = 1;
  private pageSize = 20;
  public active = true;
  private cache = false;
  public numberOfProducts: number;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public subscriptionPlan: number;
  private uploadModalRef: NgbModalRef;
  public isStripe: boolean;

  @ViewChild(ItemSoldDirective) soldButton: ItemSoldDirective;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private eventService: EventService,
              private i18n: I18nService,
              private userService: UserService,
              private errorService: ErrorsService,
              private router: Router,
              private route: ActivatedRoute,
              private paymentService: PaymentService,
              private stripeService: StripeService) { }

  ngOnInit() {
    this.isStripe = this.stripeService.isPaymentMethodStripe();
    this.getCounters();
    this.getItems();
    const sorting: string[] = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];
    this.orderBy = [];
    sorting.forEach((sort) => {
      this.orderBy.push({
        value: sort,
        label: this.i18n.getTranslations(sort)
      });
    });

    this.eventService.subscribe('itemChangeStatus', (items) => {
      items.forEach((id: string) => {
        const index: number = _.findIndex(this.items, {'id': id});
        this.items.splice(index, 1);
      });
    });

    setTimeout(() => {
      this.router.events.takeWhile(() => this.active).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        this.end = false;
        this.getItems();
      });
      this.route.params.subscribe((params: any) => {
        if (!params.urgent) {
          this.setRedirectToTPV(false);
        }
        if (params && params.code) {
          this.cache = false;
          this.getItems();
          const modals = {
            urgent: {
              component: ProUrgentConfirmationModalComponent,
              windowClass: 'urgent-confirm',
            },
            bump: {
              component: ProBumpConfirmationModalComponent,
              windowClass: 'bump-confirm'
            }
          };
          const modalType = localStorage.getItem('transactionType');
          const modal = modalType && modals[modalType] ? modals[modalType] : modals.bump;

          let modalRef: NgbModalRef = this.modalService.open(modal.component, {
            windowClass: modal.windowClass,
            backdrop: 'static'
          });
          modalRef.componentInstance.code = params.code;
          if (params.extras) {
            modalRef.componentInstance.extras = params.extras;
          }
          modalRef.result.then(() => {
            modalRef = null;
            localStorage.removeItem('transactionType');
            if (params.code === '202') {
              this.router.navigate(['pro/catalog/checkout-extras']);
            } else {
              this.router.navigate(['pro/catalog/list']);
            }
          }, () => {
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
          this.cache = false;
          this.getItems();
          if (params.itemId) {
            this.itemService.get(params.itemId).subscribe((item: Item) => {
              this.trackingService.track(TrackingService.UPLOADFORM_SUCCESS, {categoryId: item.categoryId});
            });
          }
        } else if (params && params.urgent) {
          this.isUrgent = true;
          this.isRedirect = !this.getRedirectToTPV();
          if (!this.getRedirectToTPV()) {
            setTimeout(() => {
              this.getUrgentPrice(params.itemId);
            }, 3000);
          }
        } else if (params && params.updated) {
          this.cache = false;
          if (params.onHold) {
            this.selectedStatus = 'pending';
          }
          this.getItems();
          this.errorService.i18nSuccess('itemUpdated');
        } else if (params && params.createdOnHold) {
          this.errorService.i18nError('productCreated', ' ¡Ojo! De acuerdo con tu plan no puedes activar más productos. Contacta con ventas.motor@wallapop.com si quieres aumentar tu plan o bien desactiva otro producto para poder activar este.');
        } else if (params && params.sold && params.itemId) {
          this.itemService.get(params.itemId).subscribe((item: Item) => {
            this.soldButton.item = item;
            this.soldButton.onClick();
            this.soldButton.callback.subscribe(() => {
              this.eventService.emit('itemChanged');
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

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mines(this.page, this.pageSize, this.sortBy, this.selectedStatus, this.term, this.cache).takeWhile(() => {
      this.cache = true;
      return this.active;
    }).subscribe((items: Item[]) => {
      if (this.selectedStatus === 'sold') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: items.length});
      } else {
        this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: items.length});
      }
      this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, {page_number: this.page});
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      if (this.uploadModalRef) {
        this.uploadModalRef.componentInstance.item = this.items[0];
        this.uploadModalRef.componentInstance.urgentPrice();
      }
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public search(term: string) {
    this.term = term;
    this.page = 1;
    this.trackingService.track(TrackingService.PRODUCT_LIST_FILTERED_BY_TEXT, {filter: term, order_by: this.sortBy});
    this.getItems();
  }

  public sort(sortBy: string) {
    this.sortBy = sortBy;
    this.page = 1;
    this.trackingService.track(TrackingService.PRODUCT_LIST_ORDERED_BY, {filter: this.term, order_by: sortBy});
    this.getItems();
  }

  public filterByStatus(status: string) {
    this.selectedStatus = status;
    this.itemService.deselectItems();
    this.page = 1;
    this.cache = false;
    this.getItems();
    this.getNumberOfProducts();
  }

  public loadMore() {
    this.page++;
    this.getItems(true);
  }

  public itemChanged($event: ItemChangeEvent) {
    const index: number = _.findIndex(this.items, {'_id': $event.item.id});
    this.items.splice(index, 1);
    this.cache = false;
    this.page = 1;
    this.getCounters();
    this.getItems();
  }

  public bumpCancelled($event: ItemChangeEvent) {
    const index: number = _.findIndex(this.items, {'_id': $event.item.id});
    this.items[index].purchases = null;
    this.cache = false;
    this.page = 1;
    this.getCounters();
    this.getItems();
  }

  public deselect() {
    this.itemService.deselectItems();
  }

  public feature(orderEvent: OrderEvent) {
    const orderId: string = UUID.UUID();
    this.itemService.purchaseProducts(orderEvent.order, orderId, this.isStripe).subscribe((failedProducts: string[]) => {
      if (failedProducts && failedProducts.length) {
        this.errorService.i18nError('bumpError');
      } else {
        if (this.isStripe) {
          this.chooseCreditCard(orderId, orderEvent.total);
        } else {
          this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
            this.chooseCreditCard(orderId, orderEvent.total, financialCard);
          }, () => {
            this.setRedirectToTPV(true);
            this.sabadellSubmit.emit(orderId);
          });
        }
      }
    }, () => {
      this.deselect();
    });
  }

  private chooseCreditCard(orderId: string, total: number, financialCard?: FinancialCard) {
    const modalRef: NgbModalRef = this.modalService.open(CreditCardModalComponent, {windowClass: 'credit-card'});
    modalRef.componentInstance.financialCard = financialCard;
    modalRef.componentInstance.total = total;
    modalRef.componentInstance.orderId = orderId;
    if (!this.isStripe) {
      this.trackingService.track(TrackingService.FEATURED_PURCHASE_FINAL, {select_card: financialCard.id});
    }
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
        if (this.isStripe) {
          const code = result === 'success' ? 200 : -1;
          this.deselect();
          setTimeout(() => {
            this.router.navigate(['catalog/list', {code: code}]);
          }, 1000);
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

  public getCounters() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
    });
  }

  private setRedirectToTPV(state: boolean): void {
    localStorage.setItem('redirectToTPV', state.toString());
    this.isRedirect = state;
  }

  private getRedirectToTPV(): boolean {
    return localStorage.getItem('redirectToTPV') === 'true';
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

  public getSubscriptionPlan(plan: number) {
    this.subscriptionPlan = plan;
  }

}
