import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemChangeEvent } from './catalog-item/item-change.interface';
import * as _ from 'lodash';
import {
  ItemBulkResponse, ItemsData, Order, Product,
  SelectedItemsAction
} from '../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OrderEvent } from './selected-items/selected-product.interface';
import { UploadConfirmationModalComponent } from './modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { Counters, UserStatsResponse, AvailableSlots } from '../../core/user/user-stats.interface';
import { BumpTutorialComponent } from '../checkout/bump-tutorial/bump-tutorial.component';
import { Item } from '../../core/item/item';
import { PaymentService } from '../../core/payments/payment.service';
import { UrgentConfirmationModalComponent } from './modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { EventService } from '../../core/event/event.service';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { BuyProductModalComponent } from './modals/buy-product-modal/buy-product-modal.component';
import { ReactivateConfirmationModalComponent } from './modals/reactivate-confirmation-modal/reactivate-confirmation-modal.component';
import { I18nService } from '../../core/i18n/i18n.service';
import { UpgradePlanModalComponent } from './modals/upgrade-plan-modal/upgrade-plan-modal.component';
import { TooManyItemsModalComponent } from '../../shared/catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { ActivateItemsModalComponent } from '../../shared/catalog/catalog-item-actions/activate-items-modal/activate-items-modal.component';
import { DeactivateItemsModalComponent } from '../../shared/catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { ListingfeeConfirmationModalComponent } from './modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { CreditInfo } from '../../core/payments/payment.interface';
import { StripeService } from '../../core/stripe/stripe.service';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { SubscriptionSlot } from '../../core/subscriptions/subscriptions.interface';
import { NavLink } from '../../shared/nav-links/nav-link.interface';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../../core/user/featureflag.service';

export const NORMAL_NAV_LINKS: NavLink[] = [
  { id: 'published', display: 'Selling' },
  { id: 'sold', display: 'Sold' }
];

export const SUBSCRIPTION_SELECTED_NAV_LINKS: NavLink[] = [
  { id: 'active', display: 'Active' },
  { id: 'inactive', display: 'Inactive' },
  { id: 'sold', display: 'Sold' }
];

export const SORTS = [ 'date_desc', 'date_asc', 'price_desc', 'price_asc' ];

const TRANSACTIONS_WITH_CREDITS = ['bumpWithCredits', 'urgentWithCredits', 'reactivateWithCredits', 'purchaseListingFeeWithCredits'];

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
  private upgradePlanModalRef: NgbModalRef;
  public userCanDeactivate: boolean;
  public selectedItems: Item[];
  public creditInfo: CreditInfo;
  public isStripe: boolean;
  public subscriptionSlots: SubscriptionSlot[] = [];
  public selectedSubscriptionSlot: SubscriptionSlot;
  public navLinks: NavLink[] = [];
  private searchTerm: string;
  public searchPlaceholder: string;
  public sortItems: any[];
  public sortBy: string;
  private page = 1;
  private pageSize = 20;
  public isSubscriptions = false;
  public showPublishCTA = true;

  @ViewChild(ItemSoldDirective) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent) bumpTutorial: BumpTutorialComponent;

  constructor(public itemService: ItemService,
    private trackingService: TrackingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private errorService: ErrorsService,
    private router: Router,
    public userService: UserService,
    private eventService: EventService,
    protected i18n: I18nService,
    private stripeService: StripeService,
    private subscriptionsService: SubscriptionsService,
    private featureFlagService: FeatureflagService) {
  }

  ngOnInit() {
    this.getItems();
    this.getCreditInfo();

    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = val;
    });

    this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS).subscribe(active => {
      this.isSubscriptions = active;

      if (active) {
        this.searchPlaceholder = this.i18n.getTranslations('searchByTitle');
        this.setSortItems();
        // TODO: Replace for this when backend is ready for all kind of subscriptions
        // this.subscriptionsService.getSlots().subscribe(subscriptionSlots => {
        //   this.subscriptionSlots = subscriptionSlots;
        // });
        this.userService.getAvailableSlots().subscribe(slots => {
          if (!slots.user_can_manage) {
            return;
          }

          const category = {
            categoryId: 100,
            countryCode: 'ES',
            defaultTitle: 'Cars',
            highlighted: false,
            iconName: 'category_Cars',
            numPublishedItems: 160,
            order: '50',
            title: 'Coches',
            url: '/coches-segunda-mano',
            visible: true,
            iconColor: 'black'
          };

          const mappedSubscriptionSlot: SubscriptionSlot = { category, available: slots.num_slots_cars, limit: slots.num_max_cars };
          this.subscriptionSlots = [mappedSubscriptionSlot];
          this.showPublishCTA = slots.num_slots_cars === 0;
        });
      }
    });

    this.itemService.selectedItems$.takeWhile(() => {
      return this.active;
    }).subscribe((action: SelectedItemsAction) => {
      this.selectedItems = this.itemService.selectedItems.map((id: string) => {
        return <Item>_.find(this.items, {id: id});
      });
    });

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
            urgent: UrgentConfirmationModalComponent,
            bump: BumpConfirmationModalComponent,
            reactivate: ReactivateConfirmationModalComponent,
            listingfee: ListingfeeConfirmationModalComponent
          };
          const transactionType = localStorage.getItem('transactionType');
          let modalType;
          let modal;
          switch (transactionType) {
            case 'urgentWithCredits':
              modalType = 'urgent';
              break;
            case 'reactivateWithCredits':
              modalType = 'reactivate';
              break;
            case 'bumpWithCredits':
              modalType = 'bump';
              break;
            case 'wallapack':
              this.router.navigate(['wallacoins', { code: params.code }]);
              return;
            case 'purchaseListingFee':
            case 'purchaseListingFeeWithCredits':
              modalType = 'listingfee';
              break;
            default:
              modalType = transactionType;
          }

          if (params.code === '-1') {
            modal = modals.bump;
          } else {
            modal = modalType && modals[modalType] ? modals[modalType] : null;
          }
          if (!modal) {
            return;
          }
          let modalRef: NgbModalRef = this.modalService.open(modal, {
            windowClass: 'modal-standard',
            backdrop: 'static'
          });
          modalRef.componentInstance.code = params.code;
          modalRef.componentInstance.creditUsed = TRANSACTIONS_WITH_CREDITS.includes(transactionType);
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
            windowClass: 'modal-standard',
          });
          this.uploadModalRef.result.then((orderEvent: OrderEvent) => {
            this.uploadModalRef = null;
            if (orderEvent) {
              this.isUrgent = true;
              this.isRedirect = !this.getRedirectToTPV();
              this.feature(orderEvent, 'urgent');
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
          this.upgradePlanModalRef = this.modalService.open(UpgradePlanModalComponent, {
            windowClass: 'modal-standard',
          });
          this.upgradePlanModalRef.componentInstance.itemId = params.itemId;
          this.upgradePlanModalRef.result.then((orderEvent: OrderEvent) => {
            if (orderEvent) {
              this.purchaseListingFee(orderEvent);
            } else {
              this.upgradePlanModalRef = null;
            }
          }, () => {
          });
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

  private getCreditInfo() {
    this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
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
    this.deselect();
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

    this.updateNavLinks();

    if (!append) {
      this.init = 0;
      this.page = 1;
      this.items = [];
    } else {
      this.page++;
    }
    const status = this.selectedStatus;

    if (this.selectedSubscriptionSlot) {
      this.itemService
        .minesByCategory(
          this.page, this.pageSize, this.selectedSubscriptionSlot.category.categoryId, this.sortBy, this.selectedStatus, this.searchTerm
        )
        .subscribe(itemsByCategory => {
          this.items = append ? this.items.concat(itemsByCategory) : itemsByCategory;
          this.updateNavLinksCounters();
          this.loading = false;
        });
    } else {
      this.itemService.mine(this.init, status).subscribe((itemsData: ItemsData) => {
        const items = itemsData.data;
        if (this.selectedStatus === 'sold') {
          this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, { total_products: items.length });
        } else if (this.selectedStatus === 'published') {
          this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, { total_products: items.length });
        }
        this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, { init: this.init });
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
  }

  public itemChanged($event: ItemChangeEvent) {
    if ($event.action === 'reactivatedWithBump') {
      localStorage.setItem('transactionType', 'reactivate');
      this.feature($event.orderEvent, 'reactivate');
    } else if ($event.action === 'reactivated') {
      const index: number = _.findIndex(this.items, { '_id': $event.item.id });
      this.items[index].flags.expired = false;
    } else {
      const index: number = _.findIndex(this.items, { '_id': $event.item.id });
      this.items.splice(index, 1);
      this.getNumberOfProducts();
    }
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map((item: Item) => {
      item.selected = false;
    });
    this.itemService.selectedAction = null;
  }

  public onAction(actionType: string) {
    if (actionType === 'activate') {
      this.activate();
    }

    if (actionType === 'deactivate') {
      this.deactivate();
    }

    if (actionType === 'delete') {
      this.delete();
    }
  }

  public delete() {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 1;
    modalRef.result.then(() => {
      this.itemService.bulkDelete('active').subscribe((response: ItemBulkResponse) => {
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_DELETED, { product_ids: response.updatedIds.join(', ') });
        response.updatedIds.forEach((id: string) => {
          const index: number = _.findIndex(this.items, { 'id': id });
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
      this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, { product_ids: response.updatedIds.join(', ') });
      response.updatedIds.forEach((id: string) => {
        const index: number = _.findIndex(this.items, { 'id': id });
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

  public feature(orderEvent: OrderEvent, type?: string) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.orderEvent = orderEvent;
    modalRef.componentInstance.creditInfo = this.creditInfo;
    modalRef.result.then((result: string) => {
      this.isUrgent = false;
      this.setRedirectToTPV(false);
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    }, () => {
      this.isUrgent = false;
      this.setRedirectToTPV(false);
    });
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
    });
  }

  public purchaseListingFee(orderEvent: OrderEvent) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
    modalRef.componentInstance.type = 'listing-fee';
    modalRef.componentInstance.orderEvent = orderEvent;
    modalRef.componentInstance.creditInfo = this.creditInfo;
    localStorage.setItem('transactionType', 'purchaseListingFee');
    modalRef.result.then((result: string) => {
      this.setRedirectToTPV(false);
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    }, () => {
      this.setRedirectToTPV(false);
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
      this.feature(orderEvent, 'urgent');
    });
  }

  private setRedirectToTPV(state: boolean): void {
    localStorage.setItem('redirectToTPV', state.toString());
    this.isRedirect = state;
  }

  private getRedirectToTPV(): boolean {
    return localStorage.getItem('redirectToTPV') === 'true';
  }

  public deactivate() {
    const items = this.itemService.selectedItems;
    this.modalService.open(DeactivateItemsModalComponent).result.then(() => {
      this.itemService.deactivate().subscribe(() => {
        items.forEach((id: string) => {
          const item: Item = _.find(this.items, {'id': id});
          item.flags['onhold'] = true;
          item.selected = false;
        });
        this.getNumberOfProducts();
        this.eventService.emit('itemChanged');
      });
    });
  }

  public activate() {
    const items = this.itemService.selectedItems;
    this.modalService.open(ActivateItemsModalComponent).result.then(() => {
      this.itemService.activate().subscribe((resp: any) => {
        items.forEach((id: string) => {
          const item: Item = _.find(this.items, {'id': id});
          item.flags['onhold'] = false;
          item.selected = false;
        });
        this.getNumberOfProducts();
        this.eventService.emit('itemChanged');
      }, () => {
        this.modalService.open(TooManyItemsModalComponent, {windowClass: 'bump'})
          .result.then(() => {}, () => {});
      });
    });
  }

  public selectSubscriptionSlot(subscription: SubscriptionSlot) {
    if (this.selectedSubscriptionSlot && subscription) {
      if (this.selectedSubscriptionSlot.category.categoryId === subscription.category.categoryId) {
        return;
      }
    }

    this.itemService.deselectItems();
    this.selectedSubscriptionSlot = subscription;

    if (!subscription) {
      this.selectedStatus = 'published';
      this.searchTerm = null;
      this.sortBy = SORTS[0];
      this.updateNavLinksCounters();
    } else {
      this.selectedStatus = 'active';
    }

    this.getItems();
  }

  public updateNavLinks() {
    if (this.selectedSubscriptionSlot) {
      this.navLinks = SUBSCRIPTION_SELECTED_NAV_LINKS;
    } else {
      this.navLinks = NORMAL_NAV_LINKS;
    }
  }

  public updateNavLinksCounters() {
    this.navLinks.forEach(navLink => {
      if (navLink.id === this.selectedStatus) {
        if (this.selectedStatus === 'active') {
          navLink.counter = {
            currentVal: this.selectedSubscriptionSlot.limit - this.selectedSubscriptionSlot.available,
            maxVal: this.selectedSubscriptionSlot.limit
          };
        } else {
          navLink.counter = { currentVal: this.items.length };
        }
      }
    });
  }

  public onSearchInputChange(value: string) {
    this.searchTerm = value;
    this.getItems();
  }

  public setSortItems() {
    this.sortItems = [];
    SORTS.forEach(value => this.sortItems.push({ value, label: this.i18n.getTranslations(value) }));
    this.sortBy = SORTS[0];
  }

  public onSortChange(value: any) {
    this.sortBy = value;
    this.getItems();
  }

}
