import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { CatalogProListComponent } from './catalog-pro-list.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs/Subject';
import { ProUrgentConfirmationModalComponent } from './modals/pro-urgent-confirmation-modal/pro-urgent-confirmation-modal.component';
import { ProBumpConfirmationModalComponent } from './modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { ItemService, ITEM_STATUS } from '../../core/item/item.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { UserService } from '../../core/user/user.service';
import { PaymentService } from '../../core/payments/payment.service';
import { EventService } from '../../core/event/event.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { I18nService } from '../../core/i18n/i18n.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import {
  ITEM_ID, MOCK_ITEM, MOCK_ITEM_V3, ORDER, ORDER_EVENT,
  PRODUCT_RESPONSE
} from '../../../tests/item.fixtures.spec';
import { USERS_STATS_RESPONSE } from '../../../tests/user.fixtures.spec';
import { FINANCIAL_CARD } from '../../../tests/payments.fixtures.spec';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';

describe('CatalogProListComponent', () => {
  let component: CatalogProListComponent;
  let fixture: ComponentFixture<CatalogProListComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  const componentInstance: any = { urgentPrice: jasmine.createSpy('urgentPrice') };
  let trackingServiceSpy: jasmine.Spy;
  let itemServiceSpy: jasmine.Spy;
  let userService: UserService;
  let router: Router;
  let route: ActivatedRoute;
  let eventService: EventService;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;
  const routerEvents: Subject<any> = new Subject();
  const mockCounters = {
    sold: 0,
    publish: 0
  };
  const subscriptionPlan = 20;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogProListComponent, ItemSoldDirective ],
      providers: [
        I18nService,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
            selectedItems: [],
            mines() {
              return Observable.of([MOCK_ITEM, MOCK_ITEM]);
            },
            deselectItems() {
            },
            selectItem() {
            },
            purchaseProducts() {
            },
            getUrgentProducts() {
            },
            get() {
              return Observable.of(MOCK_ITEM_V3);
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            },
            show() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        },
        {
          provide: UserService, useValue: {
            getStats() {
              return Observable.of(USERS_STATS_RESPONSE);
            },
            me() {
              return Observable.of({});
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            show() {
              return Observable.of({});
            },
            i18nError() {
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            },
            events: routerEvents
          }
        },
        {
          provide: PaymentService, useValue: {
            pay() {
              return Observable.of({});
            }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({
              code: 200
            })
          }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogProListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
    modalService = TestBed.get(NgbModal);
    userService = TestBed.get(UserService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    errorService = TestBed.get(ErrorsService);
    trackingServiceSpy = spyOn(trackingService, 'track');
    itemServiceSpy = spyOn(itemService, 'mines').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();
    eventService = TestBed.get(EventService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should open bump confirmation modal', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      route.params = Observable.of({
        code: 200,
        extras: true
      });
      component['modalRef'] = <any>{
        componentInstance: componentInstance
      };
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
      });
      expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list']);
      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(component['modalRef'].componentInstance.extras).toBe(true);
    }));

    it('should open bump confirmation modal and redirect to extras if code is 202', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      route.params = Observable.of({
        code: '202',
      });
      component['modalRef'] = <any>{
        componentInstance: componentInstance
      };
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
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

    it('should feature order', fakeAsync(() => {
      spyOn(itemService, 'getUrgentProducts').and.returnValue(Observable.of(PRODUCT_RESPONSE));
      spyOn(localStorage, 'getItem').and.returnValue('false');
      spyOn(component, 'feature');
      route.params = Observable.of({
        urgent: true,
        itemId: MOCK_ITEM.id
      });

      component.ngOnInit();
      tick(3000);

      expect(component.isUrgent).toBe(true);
      expect(component.feature).toHaveBeenCalledWith(ORDER_EVENT);
    }));

    it('should open the urgent modal if transaction is set as urgent', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('urgent');
      spyOn(localStorage, 'removeItem');
      route.params = Observable.of({
        code: 200
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(ProUrgentConfirmationModalComponent, {
        windowClass: 'urgent-confirm',
        backdrop: 'static'
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should open the bump modal if transaction is set as bump', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      route.params = Observable.of({
        code: 200
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(ProBumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should open sold modal', fakeAsync(() => {
      route.params = Observable.of({
        sold: true,
        itemId: ITEM_ID
      });
      const onClickSpy = jasmine.createSpy('onClick');
      const emitter: EventEmitter<any> = new EventEmitter();
      component.soldButton = {
        item: null,
        onClick: onClickSpy,
        callback: emitter
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
        action: 'sold'
      });
      expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_SOLD, MOCK_ITEM_V3);
    }));

    it('should show error message if alreadyFeatured', fakeAsync(() => {
      spyOn(errorService, 'i18nError');
      route.params = Observable.of({
        alreadyFeatured: true
      });

      component.ngOnInit();
      tick();

      expect(errorService.i18nError).toHaveBeenCalledWith('alreadyFeatured');
    }));
  });

  describe('getItems', () => {
    it('should call mines with default values and set items', () => {
      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_desc', 'active', undefined, false );
      expect(component.items.length).toBe(2);
    });

    it('should track the ProductListLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_LOADED, {page_number: 1});
    });

    it('should track the ProductListSoldViewed if the selectedStatus is sold', () => {
      component['selectedStatus'] = ITEM_STATUS.SOLD;
      trackingServiceSpy.calls.reset();

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: 2});
    });

    it('should track the ProductListActiveViewed if the selectedStatus is published', () => {
      component['selectedStatus'] = ITEM_STATUS.PUBLISHED;
      trackingServiceSpy.calls.reset();

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: 2});
    });

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
    it('should track the ProductListBulkUnselected event', () => {
      component.search('term');

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_FILTERED_BY_TEXT,
        {filter: 'term', order_by: 'date_desc'});
    });
  });

  describe('sort', () => {
    it('should call mines with sorting and reset page', () => {
      component['page'] = 2;
      component.sort('date_asc');

      expect(itemService.mines).toHaveBeenCalledWith(1, 20, 'date_asc', 'active', undefined, true);
    });
    it('should track the ProductListOrderedBy event', () => {
      component['term'] = 'term';
      component.sort('date_asc');

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ORDERED_BY,
        {filter: component['term'], order_by: 'date_asc'});
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
      expect(component.counters).toEqual(USERS_STATS_RESPONSE.counters);
    });
  });

  describe('feature', () => {
    let eventId: string;
    beforeEach(() => {
      spyOn(UUID, 'UUID').and.returnValue('UUID');
    });
    describe('success', () => {
      beforeEach(() => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.of([]));
        eventId = null;
      });
      describe('with credit card', () => {
        describe('user wants old one', () => {
          beforeEach(fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.resolve('old'),
              componentInstance: componentInstance
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
              total: 10
            });
            tick(1000);
          }));

          it('should redirect without code', () => {
            expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
          });

          it('should open modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(CreditCardModalComponent, {windowClass: 'credit-card'});
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
        component.getSubscriptionPlan(subscriptionPlan);

        expect(component.subscriptionPlan).toEqual(subscriptionPlan);
      });
    });

  });

});
