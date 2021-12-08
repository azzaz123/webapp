import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CatalogManagerApiService } from '@api/catalog-manager/catalog-manager-api.service';
import { PaginatedList } from '@api/core/model';
import { ISort, SORT_KEYS } from '@api/core/model/subscriptions/items-by-subscription/sort-items.interface';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { MeApiService } from '@api/me/me-api.service';
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
import { CheapestProducts, ItemBulkResponse } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { ListingLimitService } from '@core/subscriptions/listing-limit/listing-limit.service';
import { SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { User } from '@core/user/user';
import { PERMISSIONS } from '@core/user/user-constants';
import { Counters, UserStats } from '@core/user/user-stats.interface';
import { LOCAL_STORAGE_SUGGEST_PRO_SHOWN, LOCAL_STORAGE_TRY_PRO_SLOT, UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DeactivateItemsModalComponent } from '@shared/catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { BumpSuggestionModalComponent } from '@shared/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { MODAL_ACTION, ProModalConfig } from '@shared/modals/pro-modal/pro-modal.interface';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { WallacoinsDisabledModalComponent } from '@shared/modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { NavLink } from '@shared/nav-links/nav-link.interface';
import { find, findIndex } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { BumpTutorialComponent } from '../../components/bump-tutorial/bump-tutorial.component';
import { STATUS } from '../../components/selected-items/selected-product.interface';
import { ItemChangeEvent, ITEM_CHANGE_ACTION } from '../../core/item-change.interface';
import { BumpConfirmationModalComponent } from '../../modals/bump-confirmation-modal/bump-confirmation-modal.component';

const TRANSACTIONS_WITH_CREDITS = ['bumpWithCredits', 'urgentWithCredits', 'purchaseListingFeeWithCredits'];
export const SORTS: ISort[] = [
  {
    value: SORT_KEYS.DATE_DESC,
    label: $localize`:@@web_catalog_filter_date_desc:Date: from recent to old`,
  },
  {
    value: SORT_KEYS.DATE_ASC,
    label: $localize`:@@web_catalog_filter_date_asc:Date: from old to recent`,
  },
  {
    value: SORT_KEYS.PRICE_DESC,
    label: $localize`:@@web_catalog_filter_price_desc:Price: from high to low`,
  },
  {
    value: SORT_KEYS.PRICE_ASC,
    label: $localize`:@@web_catalog_filter_price_asc:Price: from low to high`,
  },
];

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSoldDirective, { static: true }) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent, { static: true }) bumpTutorial: BumpTutorialComponent;
  public items: Item[] = [];
  public selectedStatus: STATUS | string = STATUS.PUBLISHED;
  public loading = true;
  public end: boolean;
  public scrollTop: number;
  public userCanDeactivate: boolean;
  public selectedItems: Item[];
  public creditInfo: CreditInfo;
  public subscriptionSlots: SubscriptionSlot[] = [];
  public selectedSubscriptionSlot: SubscriptionSlot;
  public navLinks: NavLink[] = [];
  public numberOfProducts: number;
  public searchPlaceholder: string;
  public sortItems: any[];
  public sortBy: SORT_KEYS;
  public normalNavLinks: NavLink[] = [];
  public subscriptionSelectedNavLinks: NavLink[] = [];
  public user: User;
  public userScore: number;
  public showTryProSlot: boolean;
  public hasTrialAvailable: boolean;
  public readonly PERMISSIONS = PERMISSIONS;
  public tierWithDiscount: Tier;
  public prosPath: string = `/${PRO_PATHS.PRO_MANAGER}`;
  public deliveryPath: string = `/${PRIVATE_PATHS.DELIVERY}`;
  public walletPath: string = `/${PRIVATE_PATHS.WALLET}`;
  private bumpSuggestionModalRef: NgbModalRef;
  private active = true;
  private firstItemLoad = true;
  private init: number | string = 0;
  private counters: Counters;
  private searchTerm: string;
  private page = 1;
  private pageSize = 20;
  private subscriptions: SubscriptionsResponse[];
  private componentSubscriptions: Subscription[] = [];

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
    private catalogManagerService: CatalogManagerApiService,
    private deviceService: DeviceDetectorService,
    private analyticsService: AnalyticsService,
    private i18nService: I18nService,
    private permissionService: NgxPermissionsService,
    private listingLimitService: ListingLimitService,
    private meApiService: MeApiService
  ) {}

  public get itemsAmount() {
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

    this.catalogManagerService.getSlots().subscribe((subscriptionSlots) => {
      this.setSubscriptionSlots(subscriptionSlots);
    });

    this.subscriptionsService
      .getSubscriptions()
      .pipe(take(1))
      .subscribe((subscriptions) => {
        if (subscriptions) {
          this.hasTrialAvailable = this.subscriptionsService.hasOneTrialSubscription(subscriptions);
          this.tierWithDiscount = this.subscriptionsService.getDefaultTierSubscriptionDiscount(subscriptions);
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

    // FIXME - Please kill this setTimeout and ensure nothing breaks
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
          };
          const transactionType = localStorage.getItem('transactionType');
          let modalType = transactionType === 'bumpWithCredits' ? 'bump' : transactionType;
          let modal;

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
          const type = params.onHoldType ? parseInt(params.onHoldType, 10) : SUBSCRIPTION_TYPES.stripe;
          this.listingLimitService.showModal(params.itemId, type);
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

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
      if (!this.selectedSubscriptionSlot) {
        this.activateNormalLinks();
      }
    });
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

  public onSelectSubscriptionSlot(subscription: SubscriptionSlot) {
    if (this.selectedSubscriptionSlot && subscription) {
      if (this.selectedSubscriptionSlot.subscription.type === subscription.subscription.type) {
        return;
      }
    }

    this.itemService.deselectItems();
    this.selectedSubscriptionSlot = subscription;

    if (!subscription) {
      this.selectedStatus = STATUS.PUBLISHED;
      this.searchTerm = null;
      this.sortBy = SORTS[0].value;
      this.trackCloseSelectedSlot();
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
    this.getItems(null, true);
  }

  public onSortChange(value: any) {
    this.sortBy = value;
    this.getItems(null, true);
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

  public onClickTryProSlot(): void {
    const event: AnalyticsEvent<ClickProSubscription> = {
      name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        screenId: SCREEN_IDS.MyCatalog,
        freeTrial: this.hasTrialAvailable,
        discount: this.subscriptionsService.hasSomeSubscriptionDiscount(this.subscriptions),
      },
    };
    this.analyticsService.trackEvent(event);
    this.router.navigate([`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`]);
  }

  public navigateToProsModule(): void {
    this.router.navigate([PRO_PATHS.PRO_MANAGER]);
  }

  private setSortItems(): void {
    this.sortItems = SORTS;
    this.sortBy = SORTS[0].value;
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

  private getItems(append?: boolean, cache?: boolean) {
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
      this.catalogManagerService
        .itemsBySubscriptionType(
          this.selectedSubscriptionSlot.subscription.type,
          this.sortBy,
          this.selectedStatus as STATUS,
          this.searchTerm,
          cache
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
      this.meApiService.getItems(this.init, status as STATUS).subscribe((itemList: PaginatedList<Item>) => {
        const items = itemList.list;
        this.init = itemList.paginationParameter;
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
      if (permissions[PERMISSIONS.subscriptions] && this.shouldShowSuggestProModal()) {
        this.openSuggestProModal(item, index);
      } else {
        this.reloadItem(item.id, index);
      }
    });
  }

  private shouldShowSuggestProModal(): boolean {
    const oneDay = 1000 * 60 * 60 * 24;
    const lastShown = this.userService.getLocalStore(LOCAL_STORAGE_SUGGEST_PRO_SHOWN);
    return lastShown ? Date.now() - parseInt(lastShown) > oneDay : true;
  }

  private openSuggestProModal(reactivatedItem: Item, index: number): void {
    const isFreeTrial = this.subscriptionsService.hasFreeTrialByCategoryId(this.subscriptions, reactivatedItem.categoryId);
    const tierDiscount = this.subscriptionsService.tierDiscountByCategoryId(this.subscriptions, reactivatedItem.categoryId);
    this.trackViewProExpiredItemsPopup(isFreeTrial, !!tierDiscount);
    this.userService.saveLocalStore(LOCAL_STORAGE_SUGGEST_PRO_SHOWN, Date.now().toString());

    const modalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    modalRef.componentInstance.modalConfig = this.getProReactivationModalConfig(isFreeTrial, tierDiscount);

    modalRef.result.then(
      (action: MODAL_ACTION) => {
        if (action !== MODAL_ACTION.PRIMARY_BUTTON) {
          this.reloadItem(reactivatedItem.id, index);
        }
      },
      () => this.reloadItem(reactivatedItem.id, index)
    );
  }

  private getProReactivationModalConfig(isFreeTrial: boolean, tierWithDiscount: Tier): ProModalConfig {
    const config: ProModalConfig = modalConfig[PRO_MODAL_TYPE.reactivation];

    if (isFreeTrial) {
      config.buttons.primary.text = $localize`:@@pro_after_reactivation_non_subscribed_user_free_trial_start_subscription_button:Start free trial`;
      return config;
    }

    if (tierWithDiscount) {
      config.buttons.primary.text = $localize`:@@pro_after_reactivation_non_subscribed_user_start_with_discount_button:Try with ${tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`;
      return config;
    }

    return config;
  }

  private trackViewProExpiredItemsPopup(freeTrial: boolean, discount: boolean): void {
    const event: AnalyticsPageView<ViewProExpiredItemsPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProExpiredItemsPopup,
      attributes: {
        screenId: SCREEN_IDS.ProSubscriptionExpiredItemsPopup,
        freeTrial,
        discount,
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

  private activateNormalLinks(): void {
    this.setNormalLinks();
    this.resetNavLinksCounters();
    this.navLinks = this.normalNavLinks;
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
        this.listingLimitService.showModal(itemId, subscriptionType);
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
        const itemsData: Item[] = [];
        let itemId: string;
        items.forEach((id: string) => {
          let item: Item = find(this.items, { id: id });
          itemsData.push(item);
        });

        if (itemsData.every((item) => item.categoryId === itemsData[0].categoryId)) {
          itemId = itemsData[0].id;
        }
        this.listingLimitService.showModal(itemId, subscriptionType);
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
      selectedSlot = this.subscriptionSlots.find((slot) => slot.subscription.category_ids.includes(items[0].categoryId));
    } else {
      selectedSlot = this.selectedSubscriptionSlot;
      const inactiveNavLink = this.getNavLinkById(STATUS.INACTIVE);
      inactiveNavLink.counter.currentVal -= items.length;
      const activeNavLink = this.getNavLinkById(STATUS.ACTIVE);
      activeNavLink.counter.currentVal += items.length;
    }

    if (!selectedSlot || typeof selectedSlot.available !== 'number') {
      return;
    }

    const updatedAvailableSlotVal = (selectedSlot.available -= items.length);
    selectedSlot.available = updatedAvailableSlotVal < 0 ? 0 : updatedAvailableSlotVal;
  }

  private updateCountersWhenDeactivate(numDeactivatedItems: number) {
    if (!this.selectedSubscriptionSlot) {
      return;
    }

    if (typeof this.selectedSubscriptionSlot.available === 'number') {
      this.selectedSubscriptionSlot.available += numDeactivatedItems;
    }

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

  private saveLocalStorage(key: string, value: string): void {
    if (this.user) {
      localStorage.setItem(`${this.user.id}-${key}`, value);
    }
  }

  get subscriptionButtonName(): string {
    return this.userService.isPro ? this.i18n.translate(TRANSLATION_KEY.WALLAPOP_PRO) : this.i18n.translate(TRANSLATION_KEY.BECOME_PRO);
  }
}
