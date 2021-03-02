import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickActivateProItem,
  ClickProSubscription,
  ConfirmActivateProItem,
  RemoveProSubscriptionBanner,
  SCREEN_IDS,
  ViewOwnSaleItems,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CategoryService } from '@core/category/category.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { HttpModule } from '@core/http/http.module';
import { I18nService } from '@core/i18n/i18n.service';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { FeatureflagService } from '@core/user/featureflag.service';
import { LOCAL_STORAGE_TRY_PRO_SLOT, UserService } from '@core/user/user.service';
import { STATUS } from '@features/catalog/components/selected-items/selected-product.interface';
import { TryProSlotComponent } from '@features/catalog/components/subscriptions-slots/try-pro-slot/try-pro-slot.component';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import {
  createItemsArray,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  ITEM_CATEGORY_ID,
  MOCK_ITEM,
  MOCK_ITEM_V3,
  MOCK_LISTING_FEE_ORDER,
  ORDER_EVENT,
} from '@fixtures/item.fixtures.spec';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { MockSubscriptionService, MOCK_SUBSCRIPTION_SLOTS, MOCK_SUBSCRIPTION_SLOT_CARS } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_USER, USER_ID, USER_INFO_RESPONSE } from '@fixtures/user.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TooManyItemsModalComponent } from '@shared/catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { BumpSuggestionModalComponent } from '@shared/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { WallacoinsDisabledModalComponent } from '@shared/modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { find, cloneDeep } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, ReplaySubject, Subject } from 'rxjs';
import { SubscriptionsSlotItemComponent } from '../../components/subscriptions-slots/subscriptions-slot-item/subscriptions-slot-item.component';
import { SubscriptionsSlotsListComponent } from '../../components/subscriptions-slots/subscriptions-slots-list/subscriptions-slots-list.component';
import { BumpConfirmationModalComponent } from '../../modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { BuyProductModalComponent } from '../../modals/buy-product-modal/buy-product-modal.component';
import { ListingfeeConfirmationModalComponent } from '../../modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;
  let toastService: ToastService;
  let itemerviceSpy: jasmine.Spy;
  let paymentService: PaymentService;
  let route: ActivatedRoute;
  let router: Router;
  let errorService: ErrorsService;
  const componentInstance: any = {
    urgentPrice: jasmine.createSpy('urgentPrice'),
    trackUploaded: jasmine.createSpy('trackUploaded'),
  };
  let modalSpy: jasmine.Spy;
  let userService: UserService;
  let eventService: EventService;
  let deviceService: DeviceDetectorService;
  let analyticsService: AnalyticsService;
  const routerEvents: Subject<any> = new Subject();
  const CURRENCY = 'wallacoins';
  const CREDITS = 1000;
  const mockCounters = {
    sold: 7,
    publish: 12,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule],
        declarations: [
          ListComponent,
          ItemSoldDirective,
          SubscriptionsSlotsListComponent,
          SubscriptionsSlotItemComponent,
          TryProSlotComponent,
        ],
        providers: [
          I18nService,
          EventService,
          ToastService,
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
          {
            provide: DeviceDetectorService,
            useClass: DeviceDetectorServiceMock,
          },
          {
            provide: CategoryService,
            useValue: {
              getCategoryById() {
                return of(CATEGORY_DATA_WEB);
              },
            },
          },
          {
            provide: ItemService,
            useValue: {
              mine() {
                return of({ data: [MOCK_ITEM, MOCK_ITEM], init: 20 });
              },
              deselectItems() {},
              bulkDelete() {},
              bulkReserve() {},
              purchaseProducts() {},
              selectItem() {},
              getUrgentProducts() {},
              get() {
                return of(MOCK_ITEM_V3);
              },
              bulkSetActivate() {},
              bulkSetDeactivate() {},
              activate() {},
              activateSingleItem() {},
              deactivate() {},
              selectedItems$: new ReplaySubject(1),
              selectedItems: [],
              getCheapestProductPrice() {
                return of({ [1]: '10' });
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: {
                  itemId: 1,
                },
              },
              params: of({
                code: 200,
              }),
            },
          },
          {
            provide: PaymentService,
            useValue: {
              getCreditInfo() {
                return of({
                  currencyName: CURRENCY,
                  credit: CREDITS,
                });
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              show() {},
              i18nError() {},
              i18nSuccess() {},
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
              events: routerEvents,
            },
          },
          {
            provide: UserService,
            useValue: {
              logout() {
                return of();
              },
              suggestPro() {
                return false;
              },
              getStats() {
                return of({
                  counters: mockCounters,
                });
              },
              me() {
                return of(MOCK_USER);
              },
              getInfo() {
                return of(USER_INFO_RESPONSE);
              },
            },
          },
          {
            provide: DeviceDetectorService,
            useClass: DeviceDetectorServiceMock,
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    modalService = TestBed.inject(NgbModal);
    toastService = TestBed.inject(ToastService);
    route = TestBed.inject(ActivatedRoute);
    paymentService = TestBed.inject(PaymentService);
    router = TestBed.inject(Router);
    errorService = TestBed.inject(ErrorsService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    deviceService = TestBed.inject(DeviceDetectorService);
    analyticsService = TestBed.inject(AnalyticsService);
    itemerviceSpy = spyOn(itemService, 'mine').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();
    spyOn(errorService, 'i18nError');
    spyOn(analyticsService, 'trackPageView');
    spyOn(analyticsService, 'trackEvent');
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    describe('getCreditInfo', () => {
      it('should set the creditInfo', () => {
        const creditInfo: CreditInfo = {
          currencyName: 'wallacoins',
          credit: 2000,
          factor: 100,
        };
        spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

        component.ngOnInit();

        expect(component.creditInfo).toEqual(creditInfo);
      });

      it('should set price to bumb suggestion modal', fakeAsync(() => {
        const creditInfo: CreditInfo = {
          currencyName: 'EUR',
          credit: 10,
          factor: 1,
        };
        spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));
        spyOn(itemService, 'getCheapestProductPrice').and.callThrough();

        component['bumpSuggestionModalRef'] = <any>{
          componentInstance: componentInstance,
        };

        component.ngOnInit();
        tick();

        expect(component['bumpSuggestionModalRef'].componentInstance.productCurrency).toEqual('EUR');
        expect(itemService.getCheapestProductPrice).toHaveBeenCalledTimes(1);
        expect(itemService.getCheapestProductPrice).toHaveBeenLastCalledWith([1]);
        expect(component['bumpSuggestionModalRef'].componentInstance.productPrice).toEqual(creditInfo.factor * 10);
      }));

      it('should set the creditInfo', () => {
        const creditInfo: CreditInfo = {
          currencyName: 'wallacoins',
          credit: 2000,
          factor: 100,
        };
        spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

        component.ngOnInit();

        expect(component.creditInfo).toEqual(creditInfo);
      });
    });

    it('should open bump confirmation modal', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'modal-standard',
        backdrop: 'static',
      });
      expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
      expect(localStorage.removeItem).toHaveBeenCalled();
    }));

    it('should reset page on router event', fakeAsync(() => {
      spyOn<any>(component, 'getItems');
      component['init'] = 40;
      component.end = true;
      component.ngOnInit();
      tick();
      routerEvents.next(new NavigationEnd(1, 'url', 'url2'));
      expect(component.scrollTop).toBe(0);
      expect(component['init']).toBe(0);
      expect(component.end).toBeFalsy();
      expect(component['getItems']).toHaveBeenCalledTimes(2);
    }));

    describe('if it`s a mobile device', () => {
      it('should not open upload confirmation modal', () => {
        spyOn(deviceService, 'isMobile').and.returnValue(true);

        component.ngOnInit();

        expect(modalService.open).not.toHaveBeenCalled();
      });
    });

    it('should open toast', fakeAsync(() => {
      spyOn(errorService, 'i18nSuccess');
      route.params = of({
        updated: true,
      });
      component.ngOnInit();
      tick();
      expect(errorService.i18nSuccess).toHaveBeenCalledWith('itemUpdated');
    }));

    describe('bump suggestion modal', () => {
      beforeEach(() => {
        route.params = of({
          created: true,
          itemId: '1',
        });
      });

      it('should open bump suggestion modal if item is created', fakeAsync(() => {
        component.ngOnInit();
        tick();

        expect(modalService.open).toHaveBeenCalledWith(BumpSuggestionModalComponent, {
          windowClass: 'modal-standard',
        });
      }));

      it('should redirect when modal CTA button modal is clicked', fakeAsync(() => {
        modalSpy.and.returnValue({
          result: Promise.resolve({ redirect: true }),
          componentInstance: { item: null },
        });
        spyOn(router, 'navigate');
        component.ngOnInit();
        tick();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['catalog/checkout', { itemId: '1' }]);
      }));

      it('should not redirect when modal is closed', fakeAsync(() => {
        modalSpy.and.returnValue({
          result: Promise.resolve({ redirect: false }),
          componentInstance: { item: null },
        });
        spyOn(router, 'navigate');
        component.ngOnInit();
        tick();

        expect(router.navigate).not.toHaveBeenCalled();
      }));
    });

    it('should open the listing fee modal if transaction is set as purchaseListingFee', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('purchaseListingFee');
      spyOn(localStorage, 'removeItem');
      route.params = of({
        code: 200,
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(ListingfeeConfirmationModalComponent, {
        windowClass: 'modal-standard',
        backdrop: 'static',
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should open the listing fee modal if transaction is set as purchaseListingFeeWithCredits', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('purchaseListingFeeWithCredits');
      spyOn(localStorage, 'removeItem');
      route.params = of({
        code: 200,
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(ListingfeeConfirmationModalComponent, {
        windowClass: 'modal-standard',
        backdrop: 'static',
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should open the too many items modal if create is on hold', fakeAsync(() => {
      route.params = of({
        createdOnHold: true,
      });

      component.ngOnInit();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(TooManyItemsModalComponent, {
        windowClass: 'modal-standard',
      });
    }));

    it('should open disable wallacoins modal if has param disableWallacoinsModal', fakeAsync(() => {
      route.params = of({
        disableWallacoinsModal: true,
      });

      component.ngOnInit();
      tick();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(WallacoinsDisabledModalComponent, {
        backdrop: 'static',
        windowClass: 'modal-standard',
      });
    }));

    it('should open the bump modal if transaction is set as bump', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      route.params = of({
        code: 200,
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'modal-standard',
        backdrop: 'static',
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should redirect to wallacoins if transaction is wallapack', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('wallapack');
      spyOn(router, 'navigate');
      route.params = of({
        code: 200,
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(router.navigate).toHaveBeenCalledWith(['wallacoins', { code: 200 }]);
    }));

    it('should open the bump modal if transaction is set as bumpWithCredits', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('bumpWithCredits');
      spyOn(localStorage, 'removeItem');
      route.params = of({
        code: 200,
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'modal-standard',
        backdrop: 'static',
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionSpent');
    }));

    it('should set selectedItems with items', () => {
      const anId = '1';
      const anotherId = '2';
      itemService.selectedAction = 'feature';
      const ITEMS = createItemsArray(5);
      component.items = ITEMS;
      itemService.selectedItems = [anId, anotherId];
      fixture.detectChanges();

      itemService.selectedItems$.next({
        id: anId,
        action: 'selected',
      });

      expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
    });

    it('should get user information', () => {
      component.ngOnInit();

      expect(component.user).toEqual(MOCK_USER);
    });

    it('should get user scoring', () => {
      component.ngOnInit();

      expect(component.userScore).toEqual(USER_INFO_RESPONSE.scoring_stars);
    });

    it('should show one catalog management card for each subscription slot from backend', fakeAsync(() => {
      spyOn(subscriptionsService, 'getSlots').and.returnValue(of(MOCK_SUBSCRIPTION_SLOTS));

      component.ngOnInit();
      tick();
      fixture.detectChanges();

      const slotsCards = fixture.debugElement.queryAll(By.directive(SubscriptionsSlotItemComponent));
      expect(slotsCards).toBeTruthy();
      expect(slotsCards.length).toEqual(MOCK_SUBSCRIPTION_SLOTS.length);
    }));
  });

  describe('logout', () => {
    it('should logout after clicking logout button', () => {
      spyOn(userService, 'logout');
      const logoutButton = fixture.debugElement.query(By.css('.logout')).nativeNode;

      logoutButton.click();

      expect(userService.logout).toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('should call mine with default values and set items', () => {
      expect(itemService.mine).toHaveBeenCalledWith(0, 'published');
      expect(component.items.length).toBe(2);
    });

    it('should set init', () => {
      expect(component['init']).toBe(20);
    });
    it('should set end true if no init', () => {
      itemerviceSpy.and.returnValue(of({ data: [MOCK_ITEM, MOCK_ITEM], init: null }));
      component.ngOnInit();
      expect(component['end']).toBeTruthy();
    });
    it('should set item to bumb suggestion modal', fakeAsync(() => {
      component['bumpSuggestionModalRef'] = <any>{
        componentInstance: componentInstance,
      };

      component.ngOnInit();
      tick();

      expect(component['bumpSuggestionModalRef'].componentInstance.item).toEqual(component.items[0]);
    }));
  });

  describe('filterByStatus', () => {
    beforeEach(() => {
      itemerviceSpy.calls.reset();
    });
    it('should call mine with filtering and reset page', () => {
      component['init'] = 20;
      component.filterByStatus('sold');
      expect(itemService.mine).toHaveBeenCalledWith(0, 'sold');
    });
    it('should not call mine if filter is the same', () => {
      component.selectedStatus = 'sold';
      component.filterByStatus('sold');
      expect(itemService.mine).not.toHaveBeenCalled();
    });
  });

  describe('loadMore', () => {
    it('should call mine with new page and append items', () => {
      component['init'] = 20;
      component.loadMore();
      expect(itemService.mine).toHaveBeenCalledWith(20, 'published');
      expect(component.items.length).toBe(4);
    });
  });

  describe('item changed', () => {
    const TOTAL = 5;
    let item: Item;

    it('should remove item when deleted', () => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];

      component.itemChanged({
        item: item,
        action: 'deleted',
      });

      expect(component.items.length).toBe(TOTAL - 1);
      expect(find(component.items, { id: item.id })).toBeFalsy();
    });

    it('should call feature if event is reactivatedWithBump', () => {
      spyOn(component, 'feature');

      component.itemChanged({
        orderEvent: ORDER_EVENT,
        action: 'reactivatedWithBump',
      });

      expect(component.feature).toHaveBeenCalledWith(ORDER_EVENT, 'reactivate');
    });

    it('should change expired flag item if event is reactivated', () => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];

      component.itemChanged({
        item: item,
        action: 'reactivated',
      });

      expect(component.items[3].flags.expired).toBe(false);
    });
  });

  describe('deselect', () => {
    it('should call deselectItems', () => {
      spyOn(itemService, 'deselectItems');
      component.deselect();
      expect(itemService.deselectItems).toHaveBeenCalled();
    });
  });

  describe('onAction', () => {
    it('should call activate', () => {
      spyOn(component, 'activate');

      component.onAction('activate');

      expect(component.activate).toHaveBeenCalledTimes(1);
    });

    it('should call deactivate', () => {
      spyOn(component, 'deactivate');

      component.onAction('deactivate');

      expect(component.deactivate).toHaveBeenCalledTimes(1);
    });

    it('should call delete', () => {
      spyOn(component, 'delete');

      component.onAction('delete');

      expect(component.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    const TOTAL = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
    });
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(of(ITEMS_BULK_RESPONSE));
        spyOn(component, 'getNumberOfProducts');
        component.delete();
        tick();
      }));
      it('should call modal and bulkDelete', () => {
        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
          windowClass: 'modal-prompt',
        });
        expect(itemService.bulkDelete).toHaveBeenCalledWith('active');
      });
      it('should remove deleted items', () => {
        expect(component.items.length).toBe(TOTAL - 3);
        expect(find(component.items, { id: '1' })).toBeFalsy();
        expect(find(component.items, { id: '3' })).toBeFalsy();
        expect(find(component.items, { id: '5' })).toBeFalsy();
      });
      it('should call getNumberOfProducts', () => {
        expect(component.getNumberOfProducts).toHaveBeenCalled();
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(of(ITEMS_BULK_RESPONSE_FAILED));
        component.delete();
        tick();
      }));
      it('should open error toast', () => {
        expect(errorService.i18nError).toHaveBeenCalledWith('bulkDeleteError');
      });
    });
  });

  describe('reserve', () => {
    const TOTAL = 5;
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(of(ITEMS_BULK_RESPONSE));
        spyOn(eventService, 'emit');
        component.items = [];
        for (let i = 1; i <= TOTAL; i++) {
          component.items.push(
            new Item(i.toString(), i, i.toString(), null, null, null, null, null, null, null, null, {
              pending: false,
              sold: false,
              favorite: false,
              reserved: false,
              removed: false,
              banned: false,
              expired: false,
              review_done: false,
              bumped: false,
              highlighted: false,
            })
          );
        }
        component.reserve();
        tick();
      }));

      it('should set items as reserved', () => {
        expect(component.items[0].reserved).toBeTruthy();
        expect(component.items[1].reserved).toBeFalsy();
        expect(component.items[2].reserved).toBeTruthy();
        expect(component.items[3].reserved).toBeFalsy();
        expect(component.items[4].reserved).toBeTruthy();
      });

      it('should not call toast', () => {
        expect(errorService.i18nError).not.toHaveBeenCalled();
      });

      it('should emit ITEM_RESERVED event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, component.items[0]);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, component.items[2]);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, component.items[4]);
      });
    });

    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(of(ITEMS_BULK_RESPONSE_FAILED));
        component.reserve();
        tick();
      }));
      it('should open error toast', () => {
        expect(errorService.i18nError).toHaveBeenCalledWith('bulkReserveError');
      });
    });
  });

  describe('feature', () => {
    const componentInstance: any = {};

    it('should open modal', () => {
      modalSpy.and.returnValue({
        componentInstance: componentInstance,
        result: Promise.resolve('success'),
      });

      component.feature(ORDER_EVENT, 'urgent');

      expect(componentInstance.type).toBe('urgent');
      expect(componentInstance.orderEvent).toBe(ORDER_EVENT);
    });

    describe('success', () => {
      it('should redirect to success', fakeAsync(() => {
        modalSpy.and.returnValue({
          componentInstance: componentInstance,
          result: Promise.resolve('success'),
        });
        spyOn(router, 'navigate');

        component.feature(ORDER_EVENT, 'urgent');
        tick();

        expect(router.navigate).toHaveBeenCalledWith(['catalog/list', { code: 200 }]);
      }));
    });

    describe('error', () => {
      it('should redirect to error', fakeAsync(() => {
        modalSpy.and.returnValue({
          componentInstance: componentInstance,
          result: Promise.resolve('error'),
        });
        spyOn(router, 'navigate');

        component.feature(ORDER_EVENT, 'urgent');
        tick();

        expect(router.navigate).toHaveBeenCalledWith(['catalog/list', { code: -1 }]);
      }));
    });
  });

  describe('getNumberOfProducts', () => {
    beforeEach(() => {
      spyOn(component, 'getNumberOfProducts').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    });

    it('should call getStats method form the userService when invoked', () => {
      component.getNumberOfProducts();
      component.filterByStatus('published');

      expect(userService.getStats).toHaveBeenCalled();
    });

    it('should call setNumberOfProducts method when invoked', () => {
      component.getNumberOfProducts();
      component.filterByStatus('published');

      expect(component.getNumberOfProducts).toHaveBeenCalled();
    });
  });

  describe('setNumberOfProducts', () => {
    beforeEach(() => {
      spyOn(component, 'getNumberOfProducts').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    });

    it('should set numberOfProducts to the numberOfPublishedProducts when published filter is selected', () => {
      component.getNumberOfProducts();
      component.filterByStatus('published');

      expect(component.numberOfProducts).toEqual(mockCounters.publish);
    });

    it('should set numberOfProducts to the numberOfSoldProducts when sold filter is selected', () => {
      component.getNumberOfProducts();
      component.filterByStatus('sold');

      expect(component.numberOfProducts).toEqual(mockCounters.sold);
    });
  });

  describe('activate multiple items', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      spyOn(itemService, 'activate').and.returnValue(of('200'));
      component.items = createItemsArray(TOTAL);
      component.selectedStatus = STATUS.INACTIVE;
      itemService.selectedItems = ['1', '2'];
      component.items[0].flags['onhold'] = true;
      component.items[0].selected = true;
    });

    it('should call activate', fakeAsync(() => {
      component.activate();
      tick();

      expect(itemService.activate).toHaveBeenCalledTimes(1);
    }));

    describe('ClickActivateProItem event', () => {
      describe('when status is inactive', () => {
        it('should track event', () => {
          const expectedEvent: AnalyticsEvent<ClickActivateProItem> = {
            name: ANALYTICS_EVENT_NAMES.ClickActivateProItem,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              screenId: SCREEN_IDS.MyCatalogInactiveSection,
              numberOfItems: 2,
            },
          };

          fixture.detectChanges();
          component.activate();

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('when status is not inactive', () => {
        it('should track event', () => {
          component.selectedStatus = STATUS.PUBLISHED;
          const expectedEvent: AnalyticsEvent<ClickActivateProItem> = {
            name: ANALYTICS_EVENT_NAMES.ClickActivateProItem,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              screenId: SCREEN_IDS.MyCatalog,
              numberOfItems: 2,
            },
          };

          component.activate();

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });

    describe('success when status is inactive', () => {
      it('should reset item selection', fakeAsync(() => {
        component.activate();
        tick();

        expect(component.items.find((item) => item.id === '1')).toBeFalsy();
      }));
    });

    describe('success when status is not inactive', () => {
      it('should reset item selection', fakeAsync(() => {
        component.selectedStatus = STATUS.PUBLISHED;

        fixture.detectChanges();
        component.activate();
        tick();

        expect(component.items[0].flags['onhold']).toBe(false);
        expect(component.items[0].selected).toBe(false);
      }));
    });

    describe('update counters', () => {
      beforeEach(() => {
        component.subscriptionSlots = [cloneDeep(MOCK_SUBSCRIPTION_SLOT_CARS)];
        component.subscriptionSlots[0].category.category_id = ITEM_CATEGORY_ID;
      });

      it('should update if there is not selected a subscription slot', fakeAsync(() => {
        component.activate();
        tick();

        expect(component.subscriptionSlots[0].available).toBe(1);
      }));

      it('should update if there is selected a subscription slot', fakeAsync(() => {
        component.selectedSubscriptionSlot = cloneDeep(MOCK_SUBSCRIPTION_SLOT_CARS);
        component.navLinks = [
          {
            id: STATUS.INACTIVE,
            display: 'navLink',
            counter: { currentVal: 0 },
          },
          { id: STATUS.ACTIVE, display: 'navLink', counter: { currentVal: 0 } },
        ];

        component.activate();
        tick();

        expect(component.selectedSubscriptionSlot.available).toBe(1);
      }));
    });
  });

  describe('activate single items', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      spyOn(itemService, 'activateSingleItem').and.returnValue(of('200'));
      component.items = createItemsArray(TOTAL);
      component.selectedStatus = STATUS.INACTIVE;
      component.items[0].flags['onhold'] = true;
      component.items[0].selected = true;
    });

    it('should call activate', fakeAsync(() => {
      component.activate(SUBSCRIPTION_TYPES.stripe, '1');
      tick();

      expect(itemService.activateSingleItem).toHaveBeenCalledTimes(1);
      expect(itemService.activateSingleItem).toHaveBeenCalledWith('1');
    }));

    describe('ClickActivateProItem event', () => {
      describe('when status is inactive', () => {
        it('should track event', () => {
          const expectedEvent: AnalyticsEvent<ClickActivateProItem> = {
            name: ANALYTICS_EVENT_NAMES.ClickActivateProItem,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              screenId: SCREEN_IDS.MyCatalogInactiveSection,
              numberOfItems: 1,
              categoryId: component.items[0].categoryId,
            },
          };

          fixture.detectChanges();
          component.activate(SUBSCRIPTION_TYPES.stripe, '1');

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('when status is not inactive', () => {
        it('should track event', () => {
          component.selectedStatus = STATUS.PUBLISHED;
          const expectedEvent: AnalyticsEvent<ClickActivateProItem> = {
            name: ANALYTICS_EVENT_NAMES.ClickActivateProItem,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              screenId: SCREEN_IDS.MyCatalog,
              numberOfItems: 1,
              categoryId: component.items[0].categoryId,
            },
          };

          component.activate(SUBSCRIPTION_TYPES.stripe, '1');

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });

    describe('success when status is inactive', () => {
      it('should reset item selection', fakeAsync(() => {
        component.activate(SUBSCRIPTION_TYPES.stripe, '1');
        tick();

        expect(component.items.find((item) => item.id === '1')).toBeFalsy();
      }));
    });

    describe('success when status is not inactive', () => {
      it('should reset item selection', fakeAsync(() => {
        component.selectedStatus = STATUS.PUBLISHED;

        fixture.detectChanges();
        component.activate(SUBSCRIPTION_TYPES.stripe, '1');
        tick();

        expect(component.items[0].flags['onhold']).toBe(false);
        expect(component.items[0].selected).toBe(false);
      }));
    });

    describe('update counters', () => {
      beforeEach(() => {
        component.subscriptionSlots = [cloneDeep(MOCK_SUBSCRIPTION_SLOT_CARS)];
        component.subscriptionSlots[0].category.category_id = ITEM_CATEGORY_ID;
      });

      it('should update if there is not selected a subscription slot', fakeAsync(() => {
        component.activate(SUBSCRIPTION_TYPES.stripe, '1');
        tick();

        expect(component.subscriptionSlots[0].available).toBe(2);
      }));

      it('should update if there is selected a subscription slot', fakeAsync(() => {
        component.selectedSubscriptionSlot = cloneDeep(MOCK_SUBSCRIPTION_SLOT_CARS);
        component.navLinks = [
          {
            id: STATUS.INACTIVE,
            display: 'navLink',
            counter: { currentVal: 0 },
          },
          { id: STATUS.ACTIVE, display: 'navLink', counter: { currentVal: 0 } },
        ];

        component.activate(SUBSCRIPTION_TYPES.stripe, '1');
        tick();

        expect(component.selectedSubscriptionSlot.available).toBe(2);
      }));
    });
  });

  describe('deactivate', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = STATUS.ACTIVE;
      component.items = createItemsArray(TOTAL);
      itemService.selectedItems = ['1'];
      component.items[0].flags['onhold'] = false;
      component.items[0].selected = true;
    });

    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'deactivate').and.returnValue(of('200'));

        component.deactivate();
        tick();
      }));

      it('should call modal and deactivate', () => {
        expect(modalService.open).toHaveBeenCalled();
        expect(itemService.deactivate).toHaveBeenCalled();
      });

      it('should reset item selection', () => {
        expect(component.items[0].flags['onhold']).toBe(true);
        expect(component.items[0].selected).toBe(false);
      });
    });
  });

  describe('purchaseListingFee', () => {
    it('should open buy listing fee product modal', () => {
      component.purchaseListingFee(MOCK_LISTING_FEE_ORDER);

      expect(modalService.open).toHaveBeenCalledWith(BuyProductModalComponent, {
        windowClass: 'modal-standard',
      });
    });
  });

  describe('when close subscription slot', () => {
    it('should track event', () => {
      const expectedEvent: AnalyticsPageView<ViewOwnSaleItems> = {
        name: ANALYTICS_EVENT_NAMES.ViewOwnSaleItems,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
          numberOfItems: mockCounters.publish,
          proSubscriptionBanner: false,
        },
      };

      component.onSelectSubscriptionSlot(null);

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('Try Pro banner', () => {
    describe('when has not to show banner', () => {
      it('should banner not visible', () => {
        spyOn(userService, 'suggestPro').and.returnValue(false);

        component.ngOnInit();
        fixture.detectChanges();

        const tryProBanner = fixture.debugElement.query(By.directive(TryProSlotComponent));
        expect(tryProBanner).toBeFalsy();
      });
    });

    describe('when has to show banner', () => {
      it('should banner be visible', () => {
        spyOn(userService, 'suggestPro').and.returnValue(true);

        component.ngOnInit();
        fixture.detectChanges();

        const tryProBanner = fixture.debugElement.query(By.directive(TryProSlotComponent));
        expect(tryProBanner).toBeTruthy();
      });
    });

    describe('when close banner', () => {
      it('should save data in local storage', () => {
        spyOn(localStorage, 'setItem');

        component.onCloseTryProSlot();
        fixture.detectChanges();

        expect(localStorage.setItem).toBeCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(`${USER_ID}-${LOCAL_STORAGE_TRY_PRO_SLOT}`, 'true');
      });

      it('should disappear banner', () => {
        component.showTryProSlot = true;

        component.onCloseTryProSlot();
        fixture.detectChanges();

        const tryProBanner = fixture.debugElement.query(By.directive(TryProSlotComponent));

        expect(tryProBanner).toBeFalsy();
      });

      it('should track RemoveProSubscriptionBanner event', () => {
        const event: AnalyticsEvent<RemoveProSubscriptionBanner> = {
          name: ANALYTICS_EVENT_NAMES.RemoveProSubscriptionBanner,
          eventType: ANALYTIC_EVENT_TYPES.UserPreference,
          attributes: {
            screenId: SCREEN_IDS.MyCatalog,
            freeTrial: component.hasTrialAvailable,
          },
        };

        component.onCloseTryProSlot();
        fixture.detectChanges();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });

    describe('when click CTA button', () => {
      it('should redirect to subscriptions', () => {
        spyOn(router, 'navigate');

        component.onClickTryProSlot();

        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['profile/subscriptions']);
      });

      it('should track ClickProSubscription event', () => {
        component.hasTrialAvailable = true;
        const event: AnalyticsEvent<ClickProSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.MyCatalog,
            freeTrial: component.hasTrialAvailable,
          },
        };

        component.onClickTryProSlot();
        fixture.detectChanges();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
  });
});
