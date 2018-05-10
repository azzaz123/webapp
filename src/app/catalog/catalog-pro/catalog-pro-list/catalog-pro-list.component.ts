import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItemBulkResponse } from '../../../core/item/item-response.interface';
import { EventService } from '../../../core/event/event.service';
import { ItemChangeEvent } from '../../list/catalog-item/item-change.interface';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UserService } from '../../../core/user/user.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { UserStatsResponse, Counters } from '../../../core/user/user-stats.interface';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { OrderEvent } from '../../list/selected-items/selected-product.interface';
import { UUID } from 'angular2-uuid';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { CreditCardModalComponent } from '../../list/modals/credit-card-modal/credit-card-modal.component';
import { PaymentService } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-catalog-pro-list',
  templateUrl: './catalog-pro-list.component.html',
  styleUrls: ['./catalog-pro-list.component.scss']
})
export class CatalogProListComponent implements OnInit {

  public items: Item[] = [];
  public scrollTop: number;
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
  private cache = true;
  public numberOfProducts: number;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public subscriptionPlan: number;
  public plannedCityPurchase: number;
  public plannedCountryPurchase: number;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private eventService: EventService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private userService: UserService,
              private errorService: ErrorsService,
              private router: Router,
              private paymentService: PaymentService) { }

  ngOnInit() {
    this.getCounters();
    let sorting: string[] = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];
    this.orderBy = [];
    sorting.forEach((sort) => {
      this.orderBy.push({
        value: sort,
        label: this.i18n.getTranslations(sort)
      });
    });

    this.getItems();

    this.eventService.subscribe('itemChangeStatus', (items) => {
      items.forEach((id: string) => {
        let index: number = _.findIndex(this.items, {'id': id});
        this.items.splice(index, 1);
      });
    });
    this.isRedirect = !this.getRedirectToTPV();
  }

  public getItems(append?: boolean, openVisibility?: boolean) {
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
      this.plannedCityPurchase = this.itemService.plannedCityPurchase;
      this.plannedCountryPurchase = this.itemService.plannedCountryPurchase;
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
    this.page = 1;
    this.getItems();
    this.getNumberOfProducts();
  }

  public loadMore() {
    this.page++;
    this.getItems(true);
  }

  public itemChanged($event: ItemChangeEvent) {
    let index: number = _.findIndex(this.items, {'_id': $event.item.id});
    this.items.splice(index, 1);
    this.getCounters();
  }

  public deselect() {
    this.itemService.deselectItems();
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
    }, () => {
      this.deselect();
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

  public getSubscriptionPlan(plan: number) {
    this.subscriptionPlan = plan;
  }

}
