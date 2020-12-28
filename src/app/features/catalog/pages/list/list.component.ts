import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { Item } from '@core/item/item';
import {
  ItemBulkResponse,
  ItemsData,
} from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { SubscriptionSlot } from '@core/subscriptions/subscriptions.interface';
import {
  SubscriptionsService,
  SUBSCRIPTION_TYPES,
} from '@core/subscriptions/subscriptions.service';
import { TrackingService } from '@core/tracking/tracking.service';
import { User } from '@core/user/user';
import { Counters, UserStats } from '@core/user/user-stats.interface';
import { UserService } from '@core/user/user.service';
import { BumpSuggestionModalComponent } from '@features/catalog/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivateItemsModalComponent } from '@shared/catalog/catalog-item-actions/activate-items-modal/activate-items-modal.component';
import { DeactivateItemsModalComponent } from '@shared/catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { TooManyItemsModalComponent } from '@shared/catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { find, findIndex } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { takeWhile } from 'rxjs/operators';
import { BumpTutorialComponent } from '../../components/bump-tutorial/bump-tutorial.component';
import {
  OrderEvent,
  STATUS,
} from '../../components/selected-items/selected-product.interface';
import { ItemChangeEvent } from '../../core/item-change.interface';
import { BumpConfirmationModalComponent } from '../../modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { BuyProductModalComponent } from '../../modals/buy-product-modal/buy-product-modal.component';
import { ListingfeeConfirmationModalComponent } from '../../modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { ReactivateConfirmationModalComponent } from '../../modals/reactivate-confirmation-modal/reactivate-confirmation-modal.component';

export const SORTS = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];

const TRANSACTIONS_WITH_CREDITS = [
  'bumpWithCredits',
  'urgentWithCredits',
  'reactivateWithCredits',
  'purchaseListingFeeWithCredits',
];

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  public items: Item[] = [];
  public selectedStatus: string = STATUS.PUBLISHED;
  public loading = true;
  private init = 0;
  public end: boolean;
  public scrollTop: number;
  private bumpSuggestionModalRef: NgbModalRef;
  private active = true;
  private firstItemLoad = true;
  public numberOfProducts: number;
  private counters: Counters;
  private tooManyItemsModalRef: NgbModalRef;
  public userCanDeactivate: boolean;
  public selectedItems: Item[];
  public creditInfo: CreditInfo;
  public subscriptionSlots: SubscriptionSlot[] = [];
  public selectedSubscriptionSlot: SubscriptionSlot;
  public navLinks: NavLink[] = [];
  private searchTerm: string;
  public searchPlaceholder: string;
  public sortItems: any[];
  public sortBy: string;
  private page = 1;
  private pageSize = 20;
  public normalNavLinks: NavLink[] = [];
  public subscriptionSelectedNavLinks: NavLink[] = [];
  public user: User;
  public userScore: number;

  @ViewChild(ItemSoldDirective, { static: true }) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent, { static: true })
  bumpTutorial: BumpTutorialComponent;

  constructor(
    public itemService: ItemService,
    private trackingService: TrackingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private errorService: ErrorsService,
    private router: Router,
    public userService: UserService,
    private eventService: EventService,
    protected i18n: I18nService,
    private subscriptionsService: SubscriptionsService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.getUserInfo();

    this.normalNavLinks = [
      { id: STATUS.PUBLISHED, display: this.i18n.getTranslations('selling') },
      { id: STATUS.SOLD, display: this.i18n.getTranslations(STATUS.SOLD) },
    ];

    if (this.deviceService.isMobile()) {
      this.normalNavLinks.push({
        id: 'reviews',
        display: this.i18n.getTranslations('reviews'),
      });
    }

    this.subscriptionSelectedNavLinks = [
      { id: STATUS.ACTIVE, display: this.i18n.getTranslations(STATUS.ACTIVE) },
      {
        id: STATUS.INACTIVE,
        display: this.i18n.getTranslations(STATUS.INACTIVE),
      },
      { id: STATUS.SOLD, display: this.i18n.getTranslations(STATUS.SOLD) },
    ];

    this.navLinks = this.normalNavLinks;
    this.setSortItems();

    this.getItems();
    this.getCreditInfo();

    this.subscriptionsService.getSlots().subscribe((subscriptionSlots) => {
      this.setSubscriptionSlots(subscriptionSlots);
    });

    this.itemService.selectedItems$
      .pipe(
        takeWhile(() => {
          return this.active;
        })
      )
      .subscribe(() => {
        this.selectedItems = this.itemService.selectedItems.map(
          (id: string) => {
            return <Item>find(this.items, { id: id });
          }
        );
      });

    setTimeout(() => {
      this.router.events.pipe(takeWhile(() => this.active)).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        this.scrollTop = 0;
        this.init = 0;
        this.end = false;
        this.getItems();
      });
      this.route.params.subscribe((params: any) => {
        if (params && params.code) {
          const modals = {
            bump: BumpConfirmationModalComponent,
            reactivate: ReactivateConfirmationModalComponent,
            listingfee: ListingfeeConfirmationModalComponent,
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
            backdrop: 'static',
          });
          modalRef.componentInstance.code = params.code;
          modalRef.componentInstance.creditUsed = TRANSACTIONS_WITH_CREDITS.includes(
            transactionType
          );
          modalRef.componentInstance.spent = localStorage.getItem(
            'transactionSpent'
          );
          modalRef.result.then(
            () => {
              modalRef = null;
              localStorage.removeItem('transactionType');
              localStorage.removeItem('transactionSpent');
              this.router.navigate(['catalog/list']);
            },
            () => {
              modalRef = null;
              localStorage.removeItem('transactionType');
              localStorage.removeItem('transactionSpent');
              this.router.navigate(['wallacoins']);
            }
          );
        }
        if (params && params.created) {
          this.showBumpSuggestionModal(params.itemId);
        } else if (params && params.updated) {
          this.errorService.i18nSuccess('itemUpdated');
        } else if (params && params.createdOnHold) {
          this.tooManyItemsModalRef = this.modalService.open(
            TooManyItemsModalComponent,
            {
              windowClass: 'modal-standard',
            }
          );
          this.tooManyItemsModalRef.componentInstance.itemId = params.itemId;
          this.tooManyItemsModalRef.componentInstance.type = params.onHoldType
            ? parseInt(params.onHoldType, 10)
            : SUBSCRIPTION_TYPES.stripe;
          this.tooManyItemsModalRef.result.then(
            (orderEvent: OrderEvent) => {
              if (orderEvent) {
                this.purchaseListingFee(orderEvent);
              }
              this.tooManyItemsModalRef = null;
            },
            () => {}
          );
        } else if (params && params.sold && params.itemId) {
          this.itemService.get(params.itemId).subscribe((item: Item) => {
            this.soldButton.item = item;
            this.soldButton.onClick();
            this.soldButton.callback.subscribe(() => {
              this.itemChanged({
                item: item,
                action: STATUS.SOLD,
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

  private showBumpSuggestionModal(itemId: string): void {
    this.bumpSuggestionModalRef = this.modalService.open(
      BumpSuggestionModalComponent,
      {
        windowClass: 'modal-standard',
      }
    );
    this.bumpSuggestionModalRef.componentInstance.itemId = itemId;
    this.bumpSuggestionModalRef.componentInstance.item = this.items[0];
    this.bumpSuggestionModalRef.result.then((redirect: boolean) => {
      if (redirect) {
        this.router.navigate(['catalog/checkout', { itemId }]);
      }
      this.bumpSuggestionModalRef = null;
    });
  }

  private getCreditInfo() {
    this.paymentService
      .getCreditInfo(false)
      .subscribe((creditInfo: CreditInfo) => {
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
        action: STATUS.SELECTED,
      });
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public filterByStatus(status: string) {
    this.deselect();

    if (status === 'reviews') {
      this.items = [];
      this.selectedStatus = status;
    }

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
    this.end = false;

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
          this.page,
          this.pageSize,
          this.selectedSubscriptionSlot.category.category_id,
          this.sortBy,
          this.selectedStatus,
          this.searchTerm
        )
        .subscribe((itemsByCategory) => {
          if (itemsByCategory) {
            this.items = append
              ? this.items.concat(itemsByCategory)
              : itemsByCategory;
            this.updateNavLinksCounters();
            this.setNumberOfProducts();
          }
          this.loading = false;
          this.end = true;
        });
    } else {
      this.itemService
        .mine(this.init, status)
        .subscribe((itemsData: ItemsData) => {
          const items = itemsData.data;
          if (this.selectedStatus === STATUS.SOLD) {
            this.trackingService.track(
              TrackingService.PRODUCT_LIST_SOLD_VIEWED,
              { total_products: items.length }
            );
          } else if (this.selectedStatus === STATUS.PUBLISHED) {
            this.trackingService.track(
              TrackingService.PRODUCT_LIST_ACTIVE_VIEWED,
              { total_products: items.length }
            );
          }
          this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, {
            init: this.init,
          });
          this.init = itemsData.init;
          this.items = append ? this.items.concat(items) : items;
          this.end = !this.init;
          if (this.bumpSuggestionModalRef) {
            this.bumpSuggestionModalRef.componentInstance.item = this.items[0];
          }
          if (this.firstItemLoad) {
            setTimeout(() => {
              this.restoreSelectedItems();
            });
          }
          this.firstItemLoad = false;
          this.getNumberOfProducts();
          this.loading = false;
        });
    }
  }

  public itemChanged($event: ItemChangeEvent) {
    if ($event.action === 'reactivatedWithBump') {
      localStorage.setItem('transactionType', 'reactivate');
      this.feature($event.orderEvent, 'reactivate');
    } else if ($event.action === 'reactivated') {
      const index: number = findIndex(this.items, { _id: $event.item.id });
      this.items[index].flags.expired = false;
    } else {
      const index: number = findIndex(this.items, { _id: $event.item.id });
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
      this.subscriptionsService.getUserSubscriptionType().subscribe((type) => {
        this.activate(type);
      });
    }

    if (actionType === 'deactivate') {
      this.deactivate();
    }

    if (actionType === 'delete') {
      this.delete();
    }
  }

  public delete() {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      {
        windowClass: 'modal-prompt',
      }
    );
    modalRef.componentInstance.type = 1;
    modalRef.result.then(
      () => {
        this.itemService
          .bulkDelete('active')
          .subscribe((response: ItemBulkResponse) => {
            this.trackingService.track(
              TrackingService.PRODUCT_LIST_BULK_DELETED,
              { product_ids: response.updatedIds.join(', ') }
            );
            response.updatedIds.forEach((id: string) => {
              const index: number = findIndex(this.items, { id: id });
              this.items.splice(index, 1);
            });
            if (response.failedIds.length) {
              this.errorService.i18nError('bulkDeleteError');
            } else {
              this.getNumberOfProducts();
            }
          });
      },
      () => {}
    );
  }

  public reserve() {
    this.itemService.bulkReserve().subscribe((response: ItemBulkResponse) => {
      this.deselect();
      this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, {
        product_ids: response.updatedIds.join(', '),
      });
      response.updatedIds.forEach((id: string) => {
        const index: number = findIndex(this.items, { id: id });
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
    const modalRef: NgbModalRef = this.modalService.open(
      BuyProductModalComponent,
      { windowClass: 'modal-standard' }
    );
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.orderEvent = orderEvent;
    modalRef.componentInstance.creditInfo = this.creditInfo;
    modalRef.result.then((result: string) => {
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    });
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
    });
  }

  public purchaseListingFee(orderEvent: OrderEvent) {
    const modalRef: NgbModalRef = this.modalService.open(
      BuyProductModalComponent,
      { windowClass: 'modal-standard' }
    );
    modalRef.componentInstance.type = 'listing-fee';
    modalRef.componentInstance.orderEvent = orderEvent;
    modalRef.componentInstance.creditInfo = this.creditInfo;
    localStorage.setItem('transactionType', 'purchaseListingFee');
    modalRef.result.then((result: string) => {
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    });
  }

  private setNumberOfProducts() {
    if (this.selectedSubscriptionSlot) {
      this.numberOfProducts = this.items.length;
      return;
    }

    if (this.selectedStatus === STATUS.SOLD) {
      this.numberOfProducts = this.counters.sold;
    } else if (this.selectedStatus === STATUS.PUBLISHED) {
      this.numberOfProducts = this.counters.publish;
    }
  }

  public deactivate() {
    const items = this.itemService.selectedItems;
    this.modalService.open(DeactivateItemsModalComponent).result.then(() => {
      this.itemService.deactivate().subscribe(() => {
        items.forEach((id: string) => {
          let item: Item = find(this.items, { id: id });
          item.flags[STATUS.ONHOLD] = true;
          item.selected = false;

          const itemIndex = this.items.indexOf(item);
          this.items.splice(itemIndex, 1);
        });
        this.getNumberOfProducts();
        this.updateCountersWhenDeactivate(items.length);
        this.eventService.emit('itemChanged');
      });
    });
  }

  public activate(subscriptionType = SUBSCRIPTION_TYPES.stripe) {
    const items = this.itemService.selectedItems;
    this.modalService.open(ActivateItemsModalComponent).result.then(() => {
      this.itemService.activate().subscribe(
        (resp: any) => {
          items.forEach((id: string) => {
            let item: Item = find(this.items, { id: id });
            item.flags[STATUS.ONHOLD] = false;
            item.selected = false;

            const itemIndex = this.items.indexOf(item);
            this.items.splice(itemIndex, 1);
          });

          this.getNumberOfProducts();
          this.updateCountersWhenActivate(items.length);

          this.eventService.emit('itemChanged');
        },
        () => {
          const modalRef = this.modalService.open(TooManyItemsModalComponent, {
            windowClass: 'modal-standard',
          });
          modalRef.componentInstance.type = subscriptionType;
        }
      );
    });
  }

  private updateCountersWhenActivate(numActivatedItems: number) {
    if (!this.selectedSubscriptionSlot) {
      return;
    }

    const updatedAvailableSlotVal = (this.selectedSubscriptionSlot.available -= numActivatedItems);
    this.selectedSubscriptionSlot.available =
      updatedAvailableSlotVal < 0 ? 0 : updatedAvailableSlotVal;

    const inactiveNavLink = this.getNavLinkById('inactive');
    inactiveNavLink.counter.currentVal -= numActivatedItems;

    const activeNavLink = this.getNavLinkById('active');
    activeNavLink.counter.currentVal += numActivatedItems;
  }

  private updateCountersWhenDeactivate(numDeactivatedItems: number) {
    if (!this.selectedSubscriptionSlot) {
      return;
    }

    this.selectedSubscriptionSlot.available += numDeactivatedItems;

    const inactiveNavLink = this.getNavLinkById('inactive');
    if (inactiveNavLink.counter) {
      inactiveNavLink.counter.currentVal += numDeactivatedItems;
    }

    const activeNavLink = this.getNavLinkById('active');
    activeNavLink.counter.currentVal -= numDeactivatedItems;
  }

  private setSubscriptionSlots(slots: SubscriptionSlot[]) {
    this.subscriptionSlots = slots;
    this.searchPlaceholder = this.i18n.getTranslations('searchByTitle');
    this.setSortItems();
  }

  public onSelectSubscriptionSlot(subscription: SubscriptionSlot) {
    if (this.selectedSubscriptionSlot && subscription) {
      if (
        this.selectedSubscriptionSlot.category.category_id ===
        subscription.category.category_id
      ) {
        return;
      }
    }

    this.itemService.deselectItems();
    this.selectedSubscriptionSlot = subscription;

    if (!subscription) {
      this.selectedStatus = STATUS.PUBLISHED;
      this.searchTerm = null;
      this.sortBy = SORTS[0];
    } else {
      this.selectedStatus = STATUS.ACTIVE;
    }

    this.updateNavLinks();
    this.getItems();
  }

  public updateNavLinks() {
    if (this.selectedSubscriptionSlot) {
      this.navLinks = this.subscriptionSelectedNavLinks;
    } else {
      this.navLinks = this.normalNavLinks;
      this.resetNavLinksCounters();
    }
  }

  public updateNavLinksCounters() {
    this.navLinks.forEach((navLink) => {
      if (navLink.id === this.selectedStatus) {
        if (this.selectedStatus === STATUS.ACTIVE) {
          navLink.counter = {
            currentVal: this.items.length,
            maxVal: this.selectedSubscriptionSlot.limit,
          };
        } else {
          navLink.counter = { currentVal: this.items.length };
        }
      }
    });
  }

  public getNavLinkById(id: string): NavLink {
    return this.navLinks.filter((navLink) => navLink.id === id)[0];
  }

  public resetNavLinksCounters() {
    this.navLinks.forEach((navLink) => (navLink.counter = null));
  }

  public onSearchInputChange(value: string) {
    this.searchTerm = value;
    this.getItems();
  }

  public setSortItems() {
    this.sortItems = [];
    SORTS.forEach((value) =>
      this.sortItems.push({ value, label: this.i18n.getTranslations(value) })
    );
    this.sortBy = SORTS[0];
  }

  public onSortChange(value: any) {
    this.sortBy = value;
    this.getItems();
  }

  private getUserInfo() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      this.userService.getInfo(user.id).subscribe((info) => {
        this.userScore = info.scoring_stars;
      });
    });
  }
}
