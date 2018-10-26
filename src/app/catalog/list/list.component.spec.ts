import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import {
  createItemsArray,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  MOCK_ITEM,
  MOCK_ITEM_V3,
  ORDER_EVENT,
  PRODUCT_RESPONSE
} from '../../../tests/item.fixtures.spec';
import { Subject } from 'rxjs/Subject';
import { UploadConfirmationModalComponent } from './modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { PaymentService } from '../../core/payments/payment.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Item } from '../../core/item/item';
import { UrgentConfirmationModalComponent } from './modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { EventService } from '../../core/event/event.service';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { MOTORPLAN_DATA } from '../../../tests/user.fixtures.spec';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  let modalService: NgbModal;
  let toastr: ToastrService;
  let trackingServiceSpy: jasmine.Spy;
  let itemerviceSpy: jasmine.Spy;
  let paymentService: PaymentService;
  let route: ActivatedRoute;
  let router: Router;
  let errorService: ErrorsService;
  const componentInstance: any = { urgentPrice: jasmine.createSpy('urgentPrice'), trackUploaded: jasmine.createSpy('trackUploaded') };
  let modalSpy: jasmine.Spy;
  let userService: UserService;
  let eventService: EventService;
  const routerEvents: Subject<any> = new Subject();
  const CURRENCY = 'wallacoins';
  const CREDITS = 1000;
  const TRANSACTION_SPENT = '50';
  const mockCounters = {
    sold: 7,
    publish: 12
  };
  const mockMotorPlan = {
    type: 'motor_plan_pro',
    subtype: 'sub_premium'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent, ItemSoldDirective],
      providers: [
        I18nService,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
          selectedItems: [],
          mine() {
            return Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: 20});
          },
          deselectItems() {
          },
          bulkDelete() {
          },
          bulkReserve() {
          },
          purchaseProducts() {
          },
          selectItem() {
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
          success() {
          }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
          params: Observable.of({
            code: 200
          })
        }
        },
        {
          provide: PaymentService, useValue: {
          getFinancialCard() {
          },
          pay() {
            return Observable.of('');
          },
          getCreditInfo() {
            return Observable.of({
              currencyName: CURRENCY,
              credit: CREDITS
            });
          }
        }
        }, {
          provide: ErrorsService, useValue: {
            show() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        }, {
          provide: Router, useValue: {
            navigate() {
            },
            events: routerEvents
          }
        },
        {
          provide: UserService, useValue: {
            getStats() {
              return Observable.of({
                counters: mockCounters
              });
            },
            getMotorPlan() {
              return Observable.of({
                motorPlan: mockMotorPlan
              });
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
    modalService = TestBed.get(NgbModal);
    toastr = TestBed.get(ToastrService);
    route = TestBed.get(ActivatedRoute);
    paymentService = TestBed.get(PaymentService);
    router = TestBed.get(Router);
    errorService = TestBed.get(ErrorsService);
    userService = TestBed.get(UserService);
    eventService = TestBed.get(EventService);
    trackingServiceSpy = spyOn(trackingService, 'track');
    itemerviceSpy = spyOn(itemService, 'mine').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();
    spyOn(errorService, 'i18nError');
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    /*beforeEach(() => {
      spyOn(paymentService, 'getCreditInfo').and.callThrough();
    });

    it('should emit the updated total credits if transactionSpent exists', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue(TRANSACTION_SPENT);
      spyOn(eventService, 'emit');
      route.params = Observable.of({
        code: 200
      });

      component.ngOnInit();
      tick();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED, CREDITS);
    }));*/

    it('should open bump confirmation modal', fakeAsync(() => {
      spyOn(router, 'navigate');
      spyOn(localStorage, 'getItem').and.returnValue('bump');
      spyOn(localStorage, 'removeItem');
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
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

    it('should open upload confirmation modal', fakeAsync(() => {
      spyOn(component, 'feature');
      spyOn(localStorage, 'getItem').and.returnValue('false');
      route.params = Observable.of({
        created: true
      });

      component.feature(ORDER_EVENT);
      component.ngOnInit();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(UploadConfirmationModalComponent, {windowClass: 'upload'});
      expect(component.feature).toHaveBeenCalledWith(ORDER_EVENT);
      expect(component.isUrgent).toBe(false);
      expect(component.isRedirect).toBe(false);
    }));

    it('should open toastr', fakeAsync(() => {
      spyOn(errorService, 'i18nSuccess');
      route.params = Observable.of({
        updated: true
      });
      component.ngOnInit();
      tick();
      expect(errorService.i18nSuccess).toHaveBeenCalledWith('itemUpdated');
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
      expect(component.isRedirect).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith('redirectToTPV');
      expect(component.feature).toHaveBeenCalledWith(ORDER_EVENT, 'urgent');
    }));

    it('should set the redirect to false if it is not urgent', fakeAsync(() => {
      spyOn(localStorage, 'setItem');
      route.params = Observable.of({
        urgent: false
      });

      component.ngOnInit();
      tick();

      expect(component.isRedirect).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('redirectToTPV', 'false');
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
      expect(modalService.open).toHaveBeenCalledWith(UrgentConfirmationModalComponent, {
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
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
    }));

    it('should redirect to wallacoins if transaction is wallapack', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('wallapack');
      spyOn(router, 'navigate');
      route.params = Observable.of({
        code: 200
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(router.navigate).toHaveBeenCalledWith(['wallacoins', { code: 200 }]);
    }));

    it('should open the bump modal if transaction is set as bumpWithCredits', fakeAsync(() => {
      spyOn(localStorage, 'getItem').and.returnValue('bumpWithCredits');
      spyOn(localStorage, 'removeItem');
      route.params = Observable.of({
        code: 200
      });

      component.ngOnInit();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('transactionType');
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {
        windowClass: 'bump-confirm',
        backdrop: 'static'
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionSpent');
    }));

    it('should subscribe to getMotorPlan', () => {
      spyOn(userService, 'getMotorPlan').and.callThrough();

      component.ngOnInit();

      expect(userService.getMotorPlan).toHaveBeenCalled();
    });

    it('should set the translated user motor plan', () => {
      spyOn(userService, 'getMotorPlan').and.returnValue(Observable.of(MOTORPLAN_DATA));

      component.ngOnInit();

      expect(component.motorPlan).toEqual({subtype: 'sub_premium', label: 'Super Motor Plan'});
    });
  });

  describe('getItems', () => {
    it('should call mine with default values and set items', () => {
      expect(itemService.mine).toHaveBeenCalledWith(0, 'published');
      expect(component.items.length).toBe(2);
    });
    it('should track the ProductListLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_LOADED, {init: 0});
    });
    it('should track the ProductListSoldViewed if the selectedStatus is sold', () => {
      component['selectedStatus'] = 'sold';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: 2});
    });
    it('should track the ProductListActiveViewed if the selectedStatus is published', () => {
      component['selectedStatus'] = 'published';
      trackingServiceSpy.calls.reset();
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: 2});
    });
    it('should set init', () => {
      expect(component['init']).toBe(20);
    });
    it('should set end true if no init', () => {
      itemerviceSpy.and.returnValue(Observable.of({data: [MOCK_ITEM, MOCK_ITEM], init: null}));
      component.ngOnInit();
      expect(component['end']).toBeTruthy();
    });
    it('should set item to upload modal and call urgentPrice', fakeAsync(() => {
      component['uploadModalRef'] = <any>{
        componentInstance: componentInstance
      };

      component.ngOnInit();
      tick();

      expect(component['uploadModalRef'].componentInstance.item).toEqual(component.items[0]);
      expect(component['uploadModalRef'].componentInstance.trackUploaded).toHaveBeenCalled();
      expect(component['uploadModalRef'].componentInstance.urgentPrice).toHaveBeenCalled();
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
        action: 'deleted'
      });

      expect(component.items.length).toBe(TOTAL - 1);
      expect(_.find(component.items, {'id': item.id})).toBeFalsy();
    });

    it('should call feature if event is reactivatedWithBump', () => {
      spyOn(component, 'feature');

      component.itemChanged({
        orderEvent: ORDER_EVENT,
        action: 'reactivatedWithBump'
      });

      expect(component.feature).toHaveBeenCalledWith(ORDER_EVENT, 'reactivate');
    });

    it('should change expired flag item if event is reactivated', () => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];

      component.itemChanged({
        item: item,
        action: 'reactivated'
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
    it('should call delete', () => {
      itemService.selectedAction = 'delete';
      spyOn(component, 'delete');
      component.onAction();
      expect(component.delete).toHaveBeenCalled();
    });
    it('should call reserve', () => {
      itemService.selectedAction = 'reserve';
      spyOn(component, 'reserve');
      component.onAction();
      expect(component.reserve).toHaveBeenCalled();
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
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
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
        expect(_.find(component.items, {'id': '1'})).toBeFalsy();
        expect(_.find(component.items, {'id': '3'})).toBeFalsy();
        expect(_.find(component.items, {'id': '5'})).toBeFalsy();
      });
      it('should track the ProductListbulkDeleted event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_DELETED, {product_ids: '1, 3, 5'});
      });
      it('should call getNumberOfProducts', () => {
        expect(component.getNumberOfProducts).toHaveBeenCalled();
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.delete();
        tick();
      }));
      it('should open error toastr', () => {
        expect(errorService.i18nError).toHaveBeenCalledWith('bulkDeleteError');
      });
    });
  });

  describe('reserve', () => {
    const TOTAL = 5;
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
        spyOn(eventService, 'emit');
        component.items = [];
        for (let i = 1; i <= TOTAL; i++) {
          component.items.push(new Item(i.toString(), i, i.toString(), null, null, null, null, null, null, null, null, {
            'pending': false,
            'sold': false,
            'favorite': false,
            'reserved': false,
            'removed': false,
            'banned': false,
            'expired': false,
            'review_done': false,
            'bumped': false,
            'highlighted': false
          }));
        }
        component.reserve();
        tick();
      }));

      it('should call the ProductListBulkReserved tracking event', () => {
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_ids: '1, 3, 5'});
      });

      it('should set items as reserved', () => {
        expect(component.items[0].reserved).toBeTruthy();
        expect(component.items[1].reserved).toBeFalsy();
        expect(component.items[2].reserved).toBeTruthy();
        expect(component.items[3].reserved).toBeFalsy();
        expect(component.items[4].reserved).toBeTruthy();
      });

      it('should not call toastr', () => {
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
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.reserve();
        tick();
      }));
      it('should open error toastr', () => {
        expect(errorService.i18nError).toHaveBeenCalledWith('bulkReserveError');
      });
    });
  });

  describe('feature', () => {

    const componentInstance: any = {};

    it('should open modal', () => {
      modalSpy.and.returnValue({
        componentInstance: componentInstance,
        result: Promise.resolve('success')
      });

      component.feature(ORDER_EVENT, 'urgent');

      expect(componentInstance.type).toBe('urgent');
      expect(componentInstance.orderEvent).toBe(ORDER_EVENT);
    });

    describe('success', () => {
      it('should redirect to success', fakeAsync(() => {
        modalSpy.and.returnValue({
          componentInstance: componentInstance,
          result: Promise.resolve('success')
        });
        spyOn(router, 'navigate');

        component.feature(ORDER_EVENT, 'urgent');
        tick();

        expect(component.isUrgent).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
      }));
    });

    describe('error', () => {
      it('should redirect to error', fakeAsync(() => {
        modalSpy.and.returnValue({
          componentInstance: componentInstance,
          result: Promise.resolve('error')
        });
        spyOn(router, 'navigate');

        component.feature(ORDER_EVENT, 'urgent');
        tick();

        expect(component.isUrgent).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: -1}]);
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


});
