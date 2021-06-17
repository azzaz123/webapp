import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ClickProSubscription,
  RemoveProSubscriptionBanner,
  ClickActivateProItem,
  SCREEN_IDS,
  ViewOwnSaleItems,
  AnalyticsEvent,
  ANALYTIC_EVENT_TYPES,
  ViewProExpiredItemsPopup,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { COLORS } from '@core/colors/colors-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { Item } from '@core/item/item';
import { CheapestProducts, ItemBulkResponse, ItemsData } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { SubscriptionSlot, SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { PERMISSIONS } from '@core/user/user-constants';
import { Counters, UserStats } from '@core/user/user-stats.interface';
import { LOCAL_STORAGE_TRY_PRO_SLOT, UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeactivateItemsModalComponent } from '@shared/catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { SuggestProModalComponent } from '@shared/catalog/modals/suggest-pro-modal/suggest-pro-modal.component';
import { TooManyItemsModalComponent } from '@shared/catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { BumpSuggestionModalComponent } from '@shared/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { WallacoinsDisabledModalComponent } from '@shared/modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { find, findIndex } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { BumpTutorialComponent } from '../../components/bump-tutorial/bump-tutorial.component';
import { OrderEvent, STATUS } from '../../components/selected-items/selected-product.interface';
import { ItemChangeEvent, ITEM_CHANGE_ACTION } from '../../core/item-change.interface';
import { BumpConfirmationModalComponent } from '../../modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { BuyProductModalComponent } from '../../modals/buy-product-modal/buy-product-modal.component';
import { ListingfeeConfirmationModalComponent } from '../../modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';

export const SORTS = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];
export const SORTS_TRANSLATION_KEYS: TRANSLATION_KEY[] = [
  TRANSLATION_KEY.DATE_DESC,
  TRANSLATION_KEY.DATE_ASC,
  TRANSLATION_KEY.PRICE_DESC,
  TRANSLATION_KEY.PRICE_ASC,
];

const TRANSACTIONS_WITH_CREDITS = ['bumpWithCredits', 'urgentWithCredits', 'purchaseListingFeeWithCredits'];

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
  public showTryProSlot: boolean;
  public hasTrialAvailable: boolean;
  private subscriptions: SubscriptionsResponse[];
  private componentSubscriptions: Subscription[] = [];
  public readonly PERMISSIONS = PERMISSIONS;

  @ViewChild(ItemSoldDirective, { static: true }) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent, { static: true })
  bumpTutorial: BumpTutorialComponent;

  constructor(
    public itemService: ItemService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private errorService: ErrorsService,
    private router: Router,
    public userService: UserService,
    private eventService: EventService,
    protected i18n: I18nService,
    private subscriptionsService: SubscriptionsService,
    private deviceService: DeviceDetectorService,
    private analyticsService: AnalyticsService,
    private i18nService: I18nService,
    private permissionService: NgxPermissionsService
  ) {}

  get itemsAmount() {
    return this.page * this.pageSize;
  }

  ngOnInit() {
    this.getUserInfo();
    this.subscriptionSelectedNavLinks = [
      { id: STATUS.ACTIVE, display: this.i18n.translate(TRANSLATION_KEY.ACTIVE) },
      {
        id: STATUS.INACTIVE,
        display: this.i18n.translate(TRANSLATION_KEY.INACTIVE),
      },
      { id: STATUS.SOLD, display: this.i18n.translate(TRANSLATION_KEY.SOLD) },
    ];

    this.activateNormalLinks();
    this.setSortItems();

    this.getItems();
    this.getCreditInfo();

    this.subscriptionsService.getSlots().subscribe((subscriptionSlots) => {
      this.setSubscriptionSlots(subscriptionSlots);
    });

    this.subscriptionsService
      .getSubscriptions()
      .pipe(take(1))
      .subscribe((subscriptions) => {
        if (subscriptions) {
          this.hasTrialAvailable = this.subscriptionsService.hasOneTrialSubscription(subscriptions);
          this.subscriptions = subscriptions;
          this.initTryProSlot();
        }
      });

    this.itemService.selectedItems$
      .pipe(
        takeWhile(() => {
          return this.active;
        })
      )
      .subscribe(() => {
        this.selectedItems = this.itemService.selectedItems.map((id: string) => {
          return <Item>find(this.items, { id: id });
        });
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
            listingfee: ListingfeeConfirmationModalComponent,
          };
          const transactionType = localStorage.getItem('transactionType');
          let modalType;
          let modal;
          switch (transactionType) {
            case 'urgentWithCredits':
              modalType = 'urgent';
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
          modalRef.componentInstance.creditUsed = TRANSACTIONS_WITH_CREDITS.includes(transactionType);
          modalRef.componentInstance.spent = localStorage.getItem('transactionSpent');
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
          this.errorService.i18nSuccess(TRANSLATION_KEY.ITEM_UPDATED);
        } else if (params && params.createdOnHold) {
          this.tooManyItemsModalRef = this.modalService.open(TooManyItemsModalComponent, {
            windowClass: 'modal-standard',
          });
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
                action: ITEM_CHANGE_ACTION.SOLD,
              });
              this.eventService.emit(EventService.ITEM_SOLD, item);
            });
          });
        } else if (params && params.alreadyFeatured) {
          this.errorService.i18nError(TRANSLATION_KEY.ALREADY_FEATURED_ERROR);
        } else if (params && params.disableWallacoinsModal) {
          this.onOpenWallacoinsModal();
        }
      });
    });
  }

  private setNormalLinks(): void {
    this.normalNavLinks = [
      { id: STATUS.PUBLISHED, display: this.i18n.translate(TRANSLATION_KEY.PUBLISHED) },
      { id: STATUS.SOLD, display: this.i18n.translate(TRANSLATION_KEY.SOLD) },
      { id: STATUS.INACTIVE, display: this.i18n.translate(TRANSLATION_KEY.INACTIVE), counter: { currentVal: this.counters?.onHold } },
    ];

    if (this.deviceService.isMobile()) {
      this.normalNavLinks.push({
        id: 'reviews',
        display: this.i18n.translate(TRANSLATION_KEY.REVIEWS),
      });
    }
  }

  private onOpenWallacoinsModal(): void {
    this.modalService.open(WallacoinsDisabledModalComponent, {
      windowClass: 'modal-standard',
      backdrop: 'static',
    });
  }

  private showBumpSuggestionModal(itemId: string): void {
    this.permissionService.permissions$.pipe(take(1)).subscribe((permissions) => {
      if (permissions[PERMISSIONS.bumps]) {
        this.bumpSuggestionModalRef = this.modalService.open(BumpSuggestionModalComponent, {
          windowClass: 'modal-standard',
        });
        this.bumpSuggestionModalRef.result.then((result: { redirect: boolean; hasPrice?: boolean }) => {
          this.bumpSuggestionModalRef = null;
          if (result?.redirect) {
            this.router.navigate(['catalog/checkout', { itemId }]);
          }
        });
      } else {
        this.errorService.i18nSuccess(TRANSLATION_KEY.TOAST_PRODUCT_CREATED);
      }
    });
  }

  private getCheapestProductPrice(modalRef: NgbModalRef, itemId: string, creditInfo: CreditInfo): void {
    this.itemService.getCheapestProductPrice([itemId]).subscribe((value: CheapestProducts) => {
      modalRef.componentInstance.productPrice = +value[itemId] * creditInfo.factor;
    });
  }

  private getCreditInfo() {
    this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
      if (this.bumpSuggestionModalRef) {
        this.getCheapestProductPrice(this.bumpSuggestionModalRef, this.route.snapshot.params['itemId'], creditInfo);
        this.bumpSuggestionModalRef.componentInstance.productCurrency = creditInfo.currencyName;
      }
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
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  public logout() {
    this.userService.logout().subscribe();
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
    if (this.selectedSubscriptionSlot) {
      this.page++;
      this.end = this.items.length < this.itemsAmount;
      return;
    }
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
            this.items = append ? this.items.concat(itemsByCategory) : itemsByCategory;
            this.updateNavLinksCounters();
            this.setNumberOfProducts();
          }
          this.loading = false;
        });
    } else {
      this.itemService.mine(this.init, status).subscribe((itemsData: ItemsData) => {
        const items = itemsData.data;
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
    if ($event.action === ITEM_CHANGE_ACTION.REACTIVATED) {
      this.reactivationAction($event.item.id);
    } else if ($event.action === ITEM_CHANGE_ACTION.ACTIVATE) {
      this.onAction($event.action, $event.item.id);
    } else {
      const index: number = findIndex(this.items, { _id: $event.item.id });
      this.items.splice(index, 1);
      this.getNumberOfProducts();
    }
  }

  private reactivationAction(id: string): void {
    const index: number = findIndex(this.items, { id });
    const reactivatedItem = this.items[index];
    reactivatedItem.flags.expired = false;
    reactivatedItem.flags.pending = true;
    if (!this.user.featured) {
      this.reactivatedNoFeaturedUser(reactivatedItem, index);
    } else {
      this.reloadItem(reactivatedItem.id, index);
    }
  }

  private reactivatedNoFeaturedUser(item: Item, index: number): void {
    this.permissionService.permissions$.pipe(take(1)).subscribe((permissions) => {
      if (permissions[PERMISSIONS.subscriptions]) {
        this.openSuggestProModal(item, index);
      } else {
        this.reloadItem(item.id, index);
      }
    });
  }

  private openSuggestProModal(reactivatedItem: Item, index: number): void {
    const isFreeTrial = this.subscriptionsService.hasFreeTrialByCategoryId(this.subscriptions, reactivatedItem.categoryId);
    this.trackViewProExpiredItemsPopup(isFreeTrial);

    const modalRef = this.modalService.open(SuggestProModalComponent, {
      windowClass: 'modal-standard',
    });

    modalRef.componentInstance.title = $localize`:@@web_suggest_pro_modal_title:If you were PRO your items wouldn’t become inactive. Sounds good, right?`;
    modalRef.componentInstance.isFreeTrial = isFreeTrial;

    modalRef.result.then(
      () => this.router.navigate(['profile/subscriptions']),
      () => this.reloadItem(reactivatedItem.id, index)
    );
  }

  private trackViewProExpiredItemsPopup(freeTrial: boolean): void {
    const event: AnalyticsPageView<ViewProExpiredItemsPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProExpiredItemsPopup,
      attributes: {
        screenId: SCREEN_IDS.ProSubscriptionExpiredItemsPopup,
        freeTrial,
      },
    };

    this.analyticsService.trackPageView(event);
  }

  private reloadItem(id: string, index: number): void {
    this.itemService
      .get(id)
      .pipe(take(1))
      .subscribe((item) => {
        this.items[index] = item;
      });
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map((item: Item) => {
      item.selected = false;
    });
    this.itemService.selectedAction = null;
  }

  public onAction(actionType: string, itemId?: string) {
    if (actionType === 'activate') {
      this.subscriptionsService.getUserSubscriptionType().subscribe((type) => {
        this.activate(type, itemId);
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
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(TRANSLATION_KEY.DELETE_ITEMS_TITLE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELETE_ITEMS_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELETE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(
      () => {
        this.itemService.bulkDelete('active').subscribe((response: ItemBulkResponse) => {
          response.updatedIds.forEach((id: string) => {
            const index: number = findIndex(this.items, { id: id });
            this.items.splice(index, 1);
          });
          if (response.failedIds.length) {
            this.errorService.i18nError(TRANSLATION_KEY.BULK_DELETE_ERROR);
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
      response.updatedIds.forEach((id: string) => {
        const index: number = findIndex(this.items, { id: id });
        if (this.items[index]) {
          this.items[index].reserved = true;
          this.eventService.emit(EventService.ITEM_RESERVED, this.items[index]);
        }
      });
      if (response.failedIds.length) {
        this.errorService.i18nError(TRANSLATION_KEY.BULK_RESERVE_ERROR);
      }
    });
  }

  public feature(orderEvent: OrderEvent, type?: string) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
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
      if (!this.selectedSubscriptionSlot) {
        this.activateNormalLinks();
      }
    });
  }

  private activateNormalLinks(): void {
    this.setNormalLinks();
    this.resetNavLinksCounters();
    this.navLinks = this.normalNavLinks;
  }

  public purchaseListingFee(orderEvent: OrderEvent) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
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

  private setNumberOfProducts(): void {
    if (this.selectedSubscriptionSlot) {
      this.numberOfProducts = this.items.length;
      return;
    }

    switch (this.selectedStatus) {
      case STATUS.SOLD:
        this.numberOfProducts = this.counters.sold;
        break;
      case STATUS.PUBLISHED:
        this.numberOfProducts = this.counters.publish;
        break;
      case STATUS.INACTIVE:
        this.numberOfProducts = this.counters.onHold;
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

  public activate(subscriptionType = SUBSCRIPTION_TYPES.stripe, itemId?: string) {
    this.trackActivateProItem(itemId);
    itemId ? this.activateSingleItem(itemId, subscriptionType) : this.activateMultiItems(subscriptionType);
  }

  private trackActivateProItem(itemId: string): void {
    const attributes: ClickActivateProItem = this.getTrackingAtributes(itemId);

    const event: AnalyticsEvent<ClickActivateProItem> = {
      name: ANALYTICS_EVENT_NAMES.ClickActivateProItem,
      eventType: ANALYTIC_EVENT_TYPES.Other,
      attributes,
    };

    this.analyticsService.trackEvent(event);
  }

  private getTrackingAtributes(itemId: string): any {
    let categoryId: number;

    if (itemId) {
      categoryId = find(this.items, { id: itemId }).categoryId;
    }

    return {
      screenId: this.selectedStatus === STATUS.INACTIVE ? SCREEN_IDS.MyCatalogInactiveSection : SCREEN_IDS.MyCatalog,
      numberOfItems: itemId ? 1 : this.itemService.selectedItems.length,
      categoryId,
    };
  }

  private activateSingleItem(itemId: string, subscriptionType: SUBSCRIPTION_TYPES): void {
    this.itemService.activateSingleItem(itemId).subscribe(
      () => {
        this.parseActivation([itemId]);
      },
      () => {
        const modalRef = this.modalService.open(TooManyItemsModalComponent, {
          windowClass: 'modal-standard',
        });
        modalRef.componentInstance.type = subscriptionType;
        modalRef.componentInstance.itemId = itemId;
      }
    );
  }

  private activateMultiItems(subscriptionType: SUBSCRIPTION_TYPES): void {
    const items = this.itemService.selectedItems;
    this.itemService.activate().subscribe(
      () => {
        this.parseActivation(items);
      },
      () => {
        const modalRef = this.modalService.open(TooManyItemsModalComponent, {
          windowClass: 'modal-standard',
        });
        const itemsData: Item[] = [];
        let itemId: string;
        items.forEach((id: string) => {
          let item: Item = find(this.items, { id: id });
          itemsData.push(item);
        });

        if (itemsData.every((item) => item.categoryId === itemsData[0].categoryId)) {
          itemId = itemsData[0].id;
        }
        modalRef.componentInstance.type = subscriptionType;
        modalRef.componentInstance.itemId = itemId;
      }
    );
  }

  private parseActivation(items: string[]): void {
    const activedItems = [];
    items.forEach((id: string) => {
      let item: Item = find(this.items, { id: id });
      activedItems.push(item);
      if (this.selectedStatus === STATUS.INACTIVE) {
        const itemIndex = this.items.indexOf(item);
        this.items.splice(itemIndex, 1);
      } else {
        item.flags[STATUS.ONHOLD] = false;
        item.selected = false;
      }
    });
    this.activationSuccessful(activedItems);
  }

  private activationSuccessful(items: Item[]): void {
    this.getNumberOfProducts();
    this.updateCountersWhenActivate(items);
    this.eventService.emit('itemChanged');
  }

  private updateCountersWhenActivate(items: Item[]): void {
    let selectedSlot: SubscriptionSlot;
    if (!this.selectedSubscriptionSlot) {
      selectedSlot = this.subscriptionSlots.find((slot) => slot.category.category_id === items[0].categoryId);
    } else {
      selectedSlot = this.selectedSubscriptionSlot;
      const inactiveNavLink = this.getNavLinkById(STATUS.INACTIVE);
      inactiveNavLink.counter.currentVal -= items.length;
      const activeNavLink = this.getNavLinkById(STATUS.ACTIVE);
      activeNavLink.counter.currentVal += items.length;
    }

    if (!selectedSlot) {
      return;
    }

    const updatedAvailableSlotVal = (selectedSlot.available -= items.length);
    selectedSlot.available = updatedAvailableSlotVal < 0 ? 0 : updatedAvailableSlotVal;
  }

  private updateCountersWhenDeactivate(numDeactivatedItems: number) {
    if (!this.selectedSubscriptionSlot) {
      return;
    }

    this.selectedSubscriptionSlot.available += numDeactivatedItems;

    const inactiveNavLink = this.getNavLinkById(STATUS.INACTIVE);
    if (inactiveNavLink.counter) {
      inactiveNavLink.counter.currentVal += numDeactivatedItems;
    }

    const activeNavLink = this.getNavLinkById(STATUS.ACTIVE);
    activeNavLink.counter.currentVal -= numDeactivatedItems;
  }

  private setSubscriptionSlots(slots: SubscriptionSlot[]) {
    this.subscriptionSlots = slots;
    this.searchPlaceholder = this.i18n.translate(TRANSLATION_KEY.SEARCH_BY_TITLE);
    this.setSortItems();
  }

  public onSelectSubscriptionSlot(subscription: SubscriptionSlot) {
    if (this.selectedSubscriptionSlot && subscription) {
      if (this.selectedSubscriptionSlot.category.category_id === subscription.category.category_id) {
        return;
      }
    }

    this.itemService.deselectItems();
    this.selectedSubscriptionSlot = subscription;

    if (!subscription) {
      this.selectedStatus = STATUS.PUBLISHED;
      this.searchTerm = null;
      this.sortBy = SORTS[0];
      this.trackCloseSelectedSlot();
    } else {
      this.selectedStatus = STATUS.ACTIVE;
    }

    this.updateNavLinks();
    this.getItems();
  }

  private trackCloseSelectedSlot(): void {
    const event: AnalyticsPageView<ViewOwnSaleItems> = {
      name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        numberOfItems: this.counters.publish,
        proSubscriptionBanner: this.showTryProSlot,
      },
    };
    this.analyticsService.trackPageView(event);
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
    this.sortItems = SORTS.map((value, i) => {
      return { value, label: this.i18n.translate(SORTS_TRANSLATION_KEYS[i]) };
    });
    this.sortBy = SORTS[0];
  }

  public onSortChange(value: any) {
    this.sortBy = value;
    this.getItems();
  }

  private getUserInfo() {
    const user = this.userService.user;

    this.user = user;
    this.userService.getInfo(user.id).subscribe((info) => {
      this.userScore = info.scoring_stars;
    });
  }

  private initTryProSlot(): void {
    this.showTryProSlot = this.userService.suggestPro();
  }

  public onCloseTryProSlot(): void {
    const event: AnalyticsEvent<RemoveProSubscriptionBanner> = {
      name: ANALYTICS_EVENT_NAMES.RemoveProSubscriptionBanner,
      eventType: ANALYTIC_EVENT_TYPES.UserPreference,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        freeTrial: this.hasTrialAvailable,
      },
    };
    this.analyticsService.trackEvent(event);
    this.saveLocalStorage(LOCAL_STORAGE_TRY_PRO_SLOT, 'true');
    this.showTryProSlot = false;
  }

  private saveLocalStorage(key: string, value: string): void {
    if (this.user) {
      localStorage.setItem(`${this.user.id}-${key}`, value);
    }
  }

  public onClickTryProSlot(): void {
    const event: AnalyticsEvent<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        freeTrial: this.hasTrialAvailable,
      },
    };
    this.analyticsService.trackEvent(event);
    this.router.navigate(['profile/subscriptions']);
  }
}
