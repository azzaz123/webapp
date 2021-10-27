import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickActivateProItem,
  ClickProSubscription,
  RemoveProSubscriptionBanner,
  SCREEN_IDS,
  ViewOwnSaleItems,
  ViewProExpiredItemsPopup,
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
import { FeatureFlagService } from '@core/user/featureflag.service';
import { LOCAL_STORAGE_SUGGEST_PRO_SHOWN, LOCAL_STORAGE_TRY_PRO_SLOT, UserService } from '@core/user/user.service';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { TryProSlotComponent } from '@private/features/catalog/components/subscriptions-slots/try-pro-slot/try-pro-slot.component';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
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
import { MockSubscriptionService, TIER_WITH_DISCOUNT } from '@fixtures/subscriptions.fixtures.spec';
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
import { of, ReplaySubject } from 'rxjs';
import { SubscriptionsSlotItemComponent } from '../../components/subscriptions-slots/subscriptions-slot-item/subscriptions-slot-item.component';
import { SubscriptionsSlotsListComponent } from '../../components/subscriptions-slots/subscriptions-slots-list/subscriptions-slots-list.component';
import { BumpConfirmationModalComponent } from '../../modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { BuyProductModalComponent } from '../../modals/buy-product-modal/buy-product-modal.component';
import { ListingfeeConfirmationModalComponent } from '../../modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';
import { ListComponent } from './list.component';
import { SuggestProModalComponent } from '@shared/catalog/modals/suggest-pro-modal/suggest-pro-modal.component';
import { ITEM_CHANGE_ACTION } from '../../core/item-change.interface';
import { Counters } from '@core/user/user-stats.interface';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { ProBadgeComponent } from '@shared/pro-badge/pro-badge.component';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent } from '@shared/button/button.component';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { DeliveryDevelopmentDirective } from '@shared/directives/delivery-development/delivery-development.directive';
import { CatalogManagerApiService } from '@api/catalog-manager/catalog-manager-api.service';
import { MOCK_SUBSCRIPTION_SLOTS, MOCK_SUBSCRIPTION_SLOT_CARS } from '@fixtures/subscription-slots.fixtures.spec';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;
  let itemerviceSpy: jasmine.Spy;
  let paymentService: PaymentService;
  let route: ActivatedRoute;
  let router: Router;
  let catalogManagerApiService: CatalogManagerApiService;
  let errorService: ErrorsService;
  const componentInstance: any = {
    trackUploaded: jasmine.createSpy('trackUploaded'),
  };
  let modalSpy: jasmine.Spy;
  let userService: UserService;
  let eventService: EventService;
  let deviceService: DeviceDetectorService;
  let analyticsService: AnalyticsService;
  let permissionService: NgxPermissionsService;
  let i18nService: I18nService;
  let featureFlagService: FeatureFlagService;

  const prosButtonSelector = '.List__button--pros';
  const deliveryButtonSelector = '.List__button--delivery';
  const walletButtonSelector = '.List__button--wallet';

  const CURRENCY = 'wallacoins';
  const CREDITS = 1000;
  const mockCounters: Partial<Counters> = {
    sold: 7,
    publish: 12,
    onHold: 5,
  };
  const FAKE_DATE_NOW = 1627743615459;
  const FAKE_DATE_LESS_24 = 1627722294000;
  const FAKE_DATE_MORE_24 = 1627635894000;
  const MOCK_LIST_ROUTES: Route[] = [
    { path: '', component: ListComponent },
    { path: PRO_PATHS.PRO_MANAGER, component: ListComponent, children: [{ path: '', component: ListComponent }] },
    {
      path: `${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`,
      component: ListComponent,
      children: [{ path: '', component: ListComponent }],
    },
    { path: `${PRIVATE_PATHS.CATALOG}/list`, component: ListComponent },
    { path: `${PRIVATE_PATHS.CATALOG}/checkout`, component: ListComponent },
    { path: `wallacoins`, component: ListComponent },
    { path: PRIVATE_PATHS.DELIVERY, component: ListComponent },
    { path: PRIVATE_PATHS.WALLET, component: ListComponent },
  ];
  const localFlagSubject = new ReplaySubject<boolean>(1);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, NgxPermissionsModule.forRoot(), RouterTestingModule.withRoutes(MOCK_LIST_ROUTES)],
        declarations: [
          ListComponent,
          ItemSoldDirective,
          SubscriptionsSlotsListComponent,
          SubscriptionsSlotItemComponent,
          TryProSlotComponent,
          ProBadgeComponent,
          DeliveryDevelopmentDirective,
          ButtonComponent,
        ],
        providers: [
          I18nService,
          EventService,
          ToastService,
          NgxPermissionsService,
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
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
            provide: UserService,
            useValue: {
              user: MOCK_USER,
              get isPro() {
                return false;
              },
              logout() {
                return of(null);
              },
              suggestPro() {
                return false;
              },
              getStats() {
                return of({
                  counters: mockCounters,
                });
              },
              getInfo() {
                return of(USER_INFO_RESPONSE);
              },
              getLocalStore() {},
              saveLocalStore() {},
            },
          },
          {
            provide: DeviceDetectorService,
            useClass: DeviceDetectorServiceMock,
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          {
            provide: CatalogManagerApiService,
            useValue: {
              getSlots() {
                return of([]);
              },
            },
          },
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
    route = TestBed.inject(ActivatedRoute);
    paymentService = TestBed.inject(PaymentService);
    router = TestBed.inject(Router);
    errorService = TestBed.inject(ErrorsService);
    userService = TestBed.inject(UserService);
    eventService = TestBed.inject(EventService);
    deviceService = TestBed.inject(DeviceDetectorService);
    analyticsService = TestBed.inject(AnalyticsService);
    permissionService = TestBed.inject(NgxPermissionsService);
    i18nService = TestBed.inject(I18nService);
    catalogManagerApiService = TestBed.inject(CatalogManagerApiService);
    featureFlagService = TestBed.inject(FeatureFlagService);

    itemerviceSpy = spyOn(itemService, 'mine').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();

    spyOn(router, 'navigate').and.callThrough();
    spyOn(errorService, 'i18nError');
    spyOn(analyticsService, 'trackPageView');
    spyOn(analyticsService, 'trackEvent');
    spyOn(featureFlagService, 'getLocalFlag').and.returnValue(localFlagSubject.asObservable());
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
      router.navigate(['']);
      tick();
      expect(component.scrollTop).toBe(0);
      expect(component['init']).toBe(0);
      expect(component.end).toBeFalsy();
      expect(component['getItems']).toHaveBeenCalledTimes(2);
    }));

    describe('when using smaller screen such a mobile phone', () => {
      let walletButton: DebugElement;
      let deliveryButton: DebugElement;

      it('should not open upload confirmation modal', () => {
        spyOn(deviceService, 'isMobile').and.returnValue(true);

        component.ngOnInit();

        expect(modalService.open).not.toHaveBeenCalled();
      });

      describe('and when wallet feature flag is enabled', () => {
        beforeEach(() => {
          localFlagSubject.next(true);
          fixture.detectChanges();

          walletButton = fixture.debugElement.query(By.css(walletButtonSelector));
        });

        it('should show a wallet button', () => {
          expect(walletButton).toBeTruthy();
        });

        describe('and when clicking the wallet button', () => {
          it('should navigate to wallet', () => {
            expect(walletButton.nativeElement.getAttribute('href')).toEqual(`/${PRIVATE_PATHS.WALLET}`);
          });
        });
      });

      // TODO: change it when we create wallet feature flag		Date: 2021/10/27
      describe('and when wallet feature flag is NOT enabled', () => {
        beforeEach(fakeAsync(() => {
          localFlagSubject.next(false);
          tick();
          fixture.detectChanges();

          walletButton = fixture.debugElement.query(By.css(walletButtonSelector));
        }));

        it('should show a wallet button', () => {
          expect(walletButton).toBeTruthy();
        });

        it('should point to the wallet path', () => {
          expect(walletButton.nativeElement.getAttribute('href')).toEqual(`/${PRIVATE_PATHS.WALLET}`);
        });
      });

      describe('and when delivery feature flag is enabled', () => {
        beforeEach(() => {
          localFlagSubject.next(true);
          fixture.detectChanges();

          deliveryButton = fixture.debugElement.query(By.css(deliveryButtonSelector));
        });

        it('should show a delivery button', () => {
          expect(deliveryButton).toBeTruthy();
        });

        describe('and when clicking the delivery button', () => {
          it('should navigate to delivery', () => {
            expect(deliveryButton.nativeElement.getAttribute('href')).toEqual(`/${PRIVATE_PATHS.DELIVERY}`);
          });
        });
      });

      describe('and when delivery feature flag is NOT enabled', () => {
        beforeEach(() => {
          localFlagSubject.next(false);
          fixture.detectChanges();

          deliveryButton = fixture.debugElement.query(By.css(deliveryButtonSelector));
        });

        it('should NOT show a delivery button', () => {
          expect(deliveryButton).toBeFalsy();
        });
      });
    });

    it('should open toast', fakeAsync(() => {
      spyOn(errorService, 'i18nSuccess');
      route.params = of({
        updated: true,
      });
      component.ngOnInit();
      tick();
      expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.ITEM_UPDATED);
    }));

    describe('bump suggestion modal', () => {
      beforeEach(() => {
        route.params = of({
          created: true,
          itemId: '1',
        });
      });

      describe('and has visibility permissions', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.bumps);
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
          component.ngOnInit();
          tick();

          expect(router.navigate).not.toHaveBeenCalled();
        }));
      });
      describe('and has not visibility permissions', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.bumps);
        });
        it('should not open suggestion bump modal', fakeAsync(() => {
          component.ngOnInit();
          tick();

          expect(modalService.open).not.toHaveBeenCalled();
        }));

        it('should show successful toast ', fakeAsync(() => {
          spyOn(errorService, 'i18nSuccess').and.callThrough();
          component.ngOnInit();
          tick();

          expect(errorService.i18nSuccess).toHaveBeenCalledTimes(1);
          expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.TOAST_PRODUCT_CREATED);
        }));
      });
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

    describe('catalog management cards', () => {
      describe('and has subscriptions permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
        });
        it('should show one catalog management card for each subscription slot from backend', fakeAsync(() => {
          spyOn(catalogManagerApiService, 'getSlots').and.returnValue(of(MOCK_SUBSCRIPTION_SLOTS));

          component.ngOnInit();
          tick();
          fixture.detectChanges();

          const slotsCards = fixture.debugElement.queryAll(By.directive(SubscriptionsSlotItemComponent));
          expect(slotsCards).toBeTruthy();
          expect(slotsCards.length).toEqual(MOCK_SUBSCRIPTION_SLOTS.length);
        }));
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should show one catalog management card for each subscription slot from backend', fakeAsync(() => {
          spyOn(catalogManagerApiService, 'getSlots').and.returnValue(of(MOCK_SUBSCRIPTION_SLOTS));

          component.ngOnInit();
          tick();
          fixture.detectChanges();

          const slotsCards = fixture.debugElement.queryAll(By.directive(SubscriptionsSlotItemComponent));
          expect(slotsCards.length).toEqual(0);
        }));
      });
    });
  });

  describe('logout', () => {
    it('should logout after clicking logout button', () => {
      spyOn(userService, 'logout').and.returnValue(of());
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
        action: ITEM_CHANGE_ACTION.DELETED,
      });

      expect(component.items.length).toBe(TOTAL - 1);
      expect(find(component.items, { id: item.id })).toBeFalsy();
    });

    it('should change expired flag item if event is reactivated', () => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];

      component.itemChanged({
        item: item,
        action: ITEM_CHANGE_ACTION.REACTIVATED,
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
        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
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
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.BULK_DELETE_ERROR);
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
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.BULK_RESERVE_ERROR);
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

    describe('and there are not an selected subscription slot', () => {
      it('should show normal links updated', () => {
        const expectedNormalNavLinks = cloneDeep(component.normalNavLinks);
        expectedNormalNavLinks[2].counter = { currentVal: mockCounters.onHold };

        component.getNumberOfProducts();
        component.filterByStatus('published');

        expect(component.navLinks).toEqual(expectedNormalNavLinks);
      });
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

    it('should set numberOfProducts to the numberOfInactiveProducts when inactive filter is selected', () => {
      component.getNumberOfProducts();
      component.filterByStatus(STATUS.INACTIVE);

      expect(component.numberOfProducts).toEqual(mockCounters.onHold);
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
        component.subscriptionSlots[0].subscription.category_ids = [ITEM_CATEGORY_ID];
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
        component.subscriptionSlots[0].subscription.category_ids = [ITEM_CATEGORY_ID];
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
    describe('and has subscriptions permission', () => {
      beforeEach(() => {
        permissionService.addPermission(PERMISSIONS.subscriptions);
      });
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
          component.onClickTryProSlot();

          expect(router.navigate).toBeCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`]);
        });

        it('should track ClickProSubscription event', () => {
          spyOn(subscriptionsService, 'hasSomeSubscriptionDiscount').and.returnValue(true);
          component.hasTrialAvailable = true;
          const event: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyCatalog,
              freeTrial: component.hasTrialAvailable,
              discount: true,
            },
          };

          component.onClickTryProSlot();
          fixture.detectChanges();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
        });
      });
    });
    describe('and has not subscriptions permission', () => {
      beforeEach(() => {
        permissionService.removePermission(PERMISSIONS.subscriptions);
      });
      it('should not show banner', () => {
        spyOn(userService, 'suggestPro').and.returnValue(true);

        component.ngOnInit();
        fixture.detectChanges();

        const tryProBanner = fixture.debugElement.query(By.directive(TryProSlotComponent));
        expect(tryProBanner).toBeFalsy();
      });
    });
  });
  describe('reactivation', () => {
    beforeEach(() => {
      permissionService.addPermission(PERMISSIONS.subscriptions);
      spyOn(itemService, 'get').and.callThrough();
      component.items = createItemsArray(5);
    });
    describe('reactivation success', () => {
      it('should set item as pending', () => {
        const item = cloneDeep(component.items[3]);

        component.itemChanged({
          item: item,
          action: ITEM_CHANGE_ACTION.REACTIVATED,
        });

        expect(component.items[3].flags.expired).toEqual(false);
        expect(component.items[3].flags.pending).toEqual(true);
      });
    });
    describe('and is not pro user', () => {
      describe('and has subscription permissions', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
          spyOn(Date, 'now').and.returnValue(FAKE_DATE_NOW);
        });
        describe('modal is shown', () => {
          describe('and has free trial category', () => {
            beforeEach(() => {
              spyOn(subscriptionsService, 'hasFreeTrialByCategoryId').and.returnValue(true);
            });
            it('should track modal', () => {
              const expectedEvent: AnalyticsPageView<ViewProExpiredItemsPopup> = {
                name: ANALYTICS_EVENT_NAMES.ViewProExpiredItemsPopup,
                attributes: {
                  screenId: SCREEN_IDS.ProSubscriptionExpiredItemsPopup,
                  freeTrial: true,
                  discount: false,
                },
              };
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
              expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
            });
          });
          describe('and has not free trial category', () => {
            beforeEach(() => {
              spyOn(subscriptionsService, 'hasFreeTrialByCategoryId').and.returnValue(false);
            });
            it('should track modal', () => {
              const expectedEvent: AnalyticsPageView<ViewProExpiredItemsPopup> = {
                name: ANALYTICS_EVENT_NAMES.ViewProExpiredItemsPopup,
                attributes: {
                  screenId: SCREEN_IDS.ProSubscriptionExpiredItemsPopup,
                  freeTrial: false,
                  discount: false,
                },
              };
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
              expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
            });
          });
          describe('and has discount', () => {
            beforeEach(() => {
              spyOn(subscriptionsService, 'tierDiscountByCategoryId').and.returnValue(TIER_WITH_DISCOUNT);
            });
            it('should track modal', () => {
              const expectedEvent: AnalyticsPageView<ViewProExpiredItemsPopup> = {
                name: ANALYTICS_EVENT_NAMES.ViewProExpiredItemsPopup,
                attributes: {
                  screenId: SCREEN_IDS.ProSubscriptionExpiredItemsPopup,
                  freeTrial: true,
                  discount: true,
                },
              };
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
              expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
            });
          });
        });
        describe('and modal was not shown before', () => {
          it('should open modal', () => {
            const item = cloneDeep(component.items[3]);

            component.itemChanged({
              item: item,
              action: ITEM_CHANGE_ACTION.REACTIVATED,
            });

            expect(modalService.open).toHaveBeenCalledWith(SuggestProModalComponent, {
              windowClass: 'modal-standard',
            });
          });
        }),
          describe('and modal was shown more than 24hs before', () => {
            beforeEach(() => {
              spyOn(userService, 'getLocalStore').and.returnValue(FAKE_DATE_MORE_24.toString());
            });
            it('should open modal', () => {
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(modalService.open).toHaveBeenCalledWith(SuggestProModalComponent, {
                windowClass: 'modal-standard',
              });
            });
          }),
          describe('and modal was shown less than 24hs before', () => {
            beforeEach(() => {
              spyOn(userService, 'getLocalStore').and.returnValue(FAKE_DATE_LESS_24.toString());
            });
            it('should open modal', () => {
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(modalService.open).not.toHaveBeenCalledWith(SuggestProModalComponent, {
                windowClass: 'modal-standard',
              });
            });
          }),
          describe('and open modal', () => {
            it('should save date', () => {
              spyOn(userService, 'saveLocalStore').and.callThrough();
              const item = cloneDeep(component.items[3]);

              component.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.REACTIVATED,
              });

              expect(userService.saveLocalStore).toHaveBeenCalledTimes(1);
              expect(userService.saveLocalStore).toHaveBeenCalledWith(LOCAL_STORAGE_SUGGEST_PRO_SHOWN, FAKE_DATE_NOW.toString());
            });
          });
        describe('and click cta button', () => {
          it('should redirect to subscriptions', fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.resolve(true),
              componentInstance: componentInstance,
            });
            const item = cloneDeep(component.items[3]);

            component.itemChanged({
              item: item,
              action: ITEM_CHANGE_ACTION.REACTIVATED,
            });
            tick();

            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`]);
          }));
        });
        describe('and click secondary button', () => {
          it('should refresh item', fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.reject(),
              componentInstance: componentInstance,
            });
            const item = cloneDeep(component.items[3]);

            component.itemChanged({
              item,
              action: ITEM_CHANGE_ACTION.REACTIVATED,
            });
            tick();

            expect(itemService.get).toHaveBeenCalledWith(item.id);
            expect(component.items[3]).toEqual(MOCK_ITEM_V3);
            expect(router.navigate).not.toHaveBeenCalled();
          }));
        });
        describe('and click close button', () => {
          it('should refresh item', fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.reject(),
              componentInstance: componentInstance,
            });
            const item = cloneDeep(component.items[3]);

            component.itemChanged({
              item,
              action: ITEM_CHANGE_ACTION.REACTIVATED,
            });
            tick();

            expect(itemService.get).toHaveBeenCalledWith(item.id);
            expect(component.items[3]).toEqual(MOCK_ITEM_V3);
            expect(router.navigate).not.toHaveBeenCalled();
          }));
        });
      });
      describe('and has not subscription permissions', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should not show modal', () => {
          component.itemChanged({
            item: component.items[3],
            action: ITEM_CHANGE_ACTION.REACTIVATED,
          });

          expect(modalService.open).not.toHaveBeenCalled();
        });
      });
    });
    describe('is pro user', () => {
      it('should not show modal', () => {
        component.user.featured = true;

        component.itemChanged({
          item: component.items[3],
          action: ITEM_CHANGE_ACTION.REACTIVATED,
        });

        expect(modalService.open).not.toHaveBeenCalled();
      });

      it('should reload item', fakeAsync(() => {
        component.user.featured = true;
        const item = cloneDeep(component.items[3]);

        component.itemChanged({
          item,
          action: ITEM_CHANGE_ACTION.REACTIVATED,
        });
        tick();

        expect(itemService.get).toHaveBeenCalledWith(item.id);
        expect(component.items[3]).toEqual(MOCK_ITEM_V3);
      }));
    });
  });

  describe('Pro button', () => {
    let proButton: DebugElement;

    describe('and has subscriptions permission', () => {
      beforeEach(async () => {
        permissionService.addPermission(PERMISSIONS.subscriptions);

        await fixture.whenStable();

        proButton = fixture.debugElement.query(By.css(prosButtonSelector));
      });

      it('should show button', () => {
        expect(proButton).toBeTruthy();
      });

      it('should redirect to pro section', () => {
        proButton.nativeElement.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([PRO_PATHS.PRO_MANAGER]);
      });

      describe('and is not pro user', () => {
        beforeEach(() => {
          jest.spyOn(userService, 'isPro', 'get').mockReturnValue(false);
          spyOn(i18nService, 'translate').and.callThrough();
          fixture.detectChanges();
        });

        it('should show become pro label', () => {
          expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.BECOME_PRO);
        });
      });

      describe('and is pro user', () => {
        beforeEach(() => {
          jest.spyOn(userService, 'isPro', 'get').mockReturnValue(true);
          spyOn(i18nService, 'translate').and.callThrough();
          fixture.detectChanges();
        });

        it('should show pro label', () => {
          expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.WALLAPOP_PRO);
        });
      });
    });

    describe('and has not subscriptions permission', () => {
      beforeEach(() => {
        permissionService.removePermission(PERMISSIONS.subscriptions);

        fixture.detectChanges();

        proButton = fixture.debugElement.query(By.css(prosButtonSelector));
      });

      it('should not show button', () => {
        expect(proButton).toBeFalsy();
      });
    });
  });
});
