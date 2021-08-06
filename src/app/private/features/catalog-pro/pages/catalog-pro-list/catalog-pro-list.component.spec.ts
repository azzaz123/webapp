import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { ItemService } from '@core/item/item.service';
import { PaymentService } from '@core/payments/payment.service';
import { UserService } from '@core/user/user.service';
import { UuidService } from '@core/uuid/uuid.service';
import { CreditCardModalComponent } from '@private/features/catalog-pro/modals/credit-card-modal/credit-card-modal.component';
import { ProBumpConfirmationModalComponent } from '@private/features/catalog-pro/modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { MOCK_ITEM, MOCK_ITEM_V3, ITEM_ID, ORDER } from '@fixtures/item.fixtures.spec';
import { createPacksFixture, createPerksModelFixture } from '@fixtures/payments.fixtures.spec';
import { MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BumpSuggestionModalComponent } from '@shared/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { of, Subject } from 'rxjs';
import { CatalogProListComponent } from './catalog-pro-list.component';
import { ITEM_CHANGE_ACTION } from '@private/features/catalog/core/item-change.interface';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('CatalogProListComponent', () => {
  let component: CatalogProListComponent;
  let fixture: ComponentFixture<CatalogProListComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  const componentInstance: any = {};
  let itemServiceSpy: jasmine.Spy;
  let userService: UserService;
  let router: Router;
  let route: ActivatedRoute;
  let eventService: EventService;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;
  let uuidService: UuidService;
  let paymentService: PaymentService;

  const routerEvents: Subject<any> = new Subject();
  const mockCounters = {
    sold: 0,
    publish: 0,
  };
  const subscriptionPlan = 20;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CatalogProListComponent, ItemSoldDirective],
        providers: [
          I18nService,
          EventService,
          {
            provide: ItemService,
            useValue: {
              selectedItems: [],
              mines() {
                return of([MOCK_ITEM, MOCK_ITEM]);
              },
              deselectItems() {},
              selectItem() {},
              purchaseProducts() {},
              getUrgentProducts() {},
              get() {
                return of(MOCK_ITEM_V3);
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
            provide: UserService,
            useValue: {
              getStats() {
                return of(MOCK_USER_STATS);
              },
              me() {
                return of({});
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              show() {
                return of({});
              },
              i18nError() {},
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
            provide: PaymentService,
            useValue: {
              pay() {
                return of({});
              },
              getPerks() {
                return of(createPerksModelFixture());
              },
              getPacks() {
                return of(createPacksFixture());
              },
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({
                code: 200,
              }),
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    errorService = TestBed.inject(ErrorsService);
    itemServiceSpy = spyOn(itemService, 'mines').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();
    eventService = TestBed.inject(EventService);
    uuidService = TestBed.inject(UuidService);
    paymentService = TestBed.inject(PaymentService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should open bump confirmation modal', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      route.params = of({
        code: 200,
        extras: true,
      });
      component['modalRef'] = <any>{
        componentInstance: componentInstance,
      };
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static',
      });
      expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list']);
      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(component['modalRef'].componentInstance.extras).toBe(true);
    }));

    describe('bump suggestion modal', () => {
      beforeEach(() => {
        route.params = of({
          created: true,
          itemId: '1',
        });
      });

      it('should open bump suggestion modal', fakeAsync(() => {
        component.ngOnInit();
        tick();

        expect(modalService.open).toHaveBeenCalledWith(BumpSuggestionModalComponent, {
          windowClass: 'modal-standard',
        });
      }));

      it('should open bump suggestion modal with the price', fakeAsync(() => {
        spyOn(paymentService, 'getPerks').and.callThrough();
        spyOn(paymentService, 'getPacks').and.callThrough();

        component.ngOnInit();
        tick();

        component['bumpSuggestionModalRef'] = <any>{
          componentInstance: componentInstance,
        };

        expect(paymentService.getPacks).toHaveBeenCalledTimes(1);
        expect(paymentService.getPacks).toHaveBeenCalledWith();
        expect(component['bumpSuggestionModalRef'].componentInstance.productPrice).toEqual(5.99);
        expect(component['bumpSuggestionModalRef'].componentInstance.productCurrency).toEqual('EUR');
      }));

      it('should open bump suggestion modal without the price', fakeAsync(() => {
        const mock = createPerksModelFixture();
        mock.subscription.national.quantity = 1;
        spyOn(paymentService, 'getPerks').and.returnValue(of(mock));
        spyOn(paymentService, 'getPacks');

        component.ngOnInit();
        tick();

        expect(paymentService.getPacks).not.toHaveBeenCalled();
      }));

      it('should redirect checkout when modal CTA button modal is clicked', fakeAsync(() => {
        modalSpy.and.returnValue({
          result: Promise.resolve({ redirect: true }),
          componentInstance: { item: null },
        });
        spyOn(router, 'navigate');
        component.ngOnInit();
        tick();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/checkout', { itemId: '1' }]);
      }));

      it('should redirect extra checkouts when modal CTA button modal is clicked', fakeAsync(() => {
        modalSpy.and.returnValue({
          result: Promise.resolve({ redirect: true, hasPrice: true }),
          componentInstance: { item: null },
        });
        spyOn(router, 'navigate');
        component.ngOnInit();
        tick();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/checkout-extras']);
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

    it('should open bump confirmation modal and redirect to extras if code is 202', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      route.params = of({
        code: '202',
      });
      component['modalRef'] = <any>{
        componentInstance: componentInstance,
      };
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static',
      });
      expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/checkout-extras']);
      expect(component['modalRef'].componentInstance.code).toBe('202');
    }));

    it('should reset page on router event', fakeAsync(() => {
      spyOn<any>(component, 'getItems');
      component['init'] = 40;
      component.end = true;
      component.ngOnInit();
      tick();
      routerEvents.next(new NavigationEnd(1, 'url', 'url2'));
      expect(component.end).toBe(false);
      expect(component['getItems']).toHaveBeenCalledTimes(3);
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
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static',
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should open sold modal', fakeAsync(() => {
      route.params = of({
        sold: true,
        itemId: ITEM_ID,
      });
      const onClickSpy = jasmine.createSpy('onClick');
      const emitter: EventEmitter<any> = new EventEmitter();
      component.soldButton = {
        item: null,
        onClick: onClickSpy,
        callback: emitter,
      } as any;
      spyOn(component, 'itemChanged');
      spyOn(eventService, 'emit');

      component.ngOnInit();
      tick();
      emitter.emit();

      expect(component.soldButton.item).toEqual(MOCK_ITEM_V3);
      expect(onClickSpy).toHaveBeenCalled();
      expect(component.itemChanged).toHaveBeenCalledWith({
        item: MOCK_ITEM_V3,
        action: ITEM_CHANGE_ACTION.SOLD,
      });
      expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_SOLD, MOCK_ITEM_V3);
    }));

    it('should show error message if alreadyFeatured', fakeAsync(() => {
      spyOn(errorService, 'i18nError');
      route.params = of({
        alreadyFeatured: true,
      });

      component.ngOnInit();
      tick();

      expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.ALREADY_FEATURED_ERROR);
    }));
  });

  describe('getItems', () => {
    it('should call mines with default values and set items', () => {
      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'active', undefined, false);
      expect(component.items.length).toBe(2);
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

  describe('loadMore', () => {
    it('should call mine with new page and append items', () => {
      component.loadMore();

      expect(itemService.mines).toHaveBeenCalledWith(2, 20, 'date_desc', 'active', undefined, true);
      expect(component.items.length).toBe(4);
    });
  });

  describe('search', () => {
    it('should call mines with search term and reset page', () => {
      component['page'] = 2;
      component.search('term');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'active', 'term', true);
    });
  });

  describe('sort', () => {
    it('should call mines with sorting and reset page', () => {
      component['page'] = 2;
      component.sort('date_asc');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_asc', 'active', undefined, true);
    });
  });

  describe('filterByStatus', () => {
    it('should call mines with filtering and reset page', () => {
      component['page'] = 2;
      component.filterByStatus('sold');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'sold', undefined, false);
    });
  });

  describe('deselect', () => {
    it('should call deselectItems', () => {
      spyOn(itemService, 'deselectItems');

      component.deselect();

      expect(itemService.deselectItems).toHaveBeenCalled();
    });
  });

  describe('getCounters', () => {
    beforeEach(() => {
      spyOn(component, 'getCounters').and.callThrough();
      spyOn(userService, 'getStats').and.callThrough();
    });

    it('should getStats have been called and get the counters', () => {
      component.getCounters();

      expect(userService.getStats).toHaveBeenCalled();
      expect(component.counters).toEqual(MOCK_USER_STATS.counters);
    });
  });

  describe('feature', () => {
    let eventId: string;
    beforeEach(() => {
      spyOn(uuidService, 'getUUID').and.returnValue('UUID');
    });
    describe('success', () => {
      beforeEach(() => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(of([]));
        eventId = null;
      });
      describe('with credit card', () => {
        describe('user wants old one', () => {
          beforeEach(fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.resolve('old'),
              componentInstance: componentInstance,
            });
            spyOn(router, 'navigate');
            spyOn(component, 'deselect');
          }));
        });
        describe('user closes modal', () => {
          beforeEach(fakeAsync(() => {
            spyOn(router, 'navigate');
            component.feature({
              order: [ORDER],
              total: 10,
            });
            tick(1000);
          }));

          it('should redirect without code', () => {
            expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
          });

          it('should open modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(CreditCardModalComponent, {
              windowClass: 'credit-card',
            });
          });

          it('should set financialCard and total to componentInstance', () => {
            expect(componentInstance.total).toBe(10);
          });

          it('should call purchaseProducts', () => {
            expect(itemService.purchaseProducts).toHaveBeenCalledWith([ORDER], 'UUID');
          });
        });
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

    describe('getSubscriptionPlan', () => {
      it('should set the subscription plan to the current one', () => {
        component.subscriptionPlan = subscriptionPlan;

        expect(component.subscriptionPlan).toEqual(subscriptionPlan);
      });
    });
  });
});
