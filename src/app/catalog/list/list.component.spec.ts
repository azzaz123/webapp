import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  createItemsArray,
  ErrorsService,
  FINANCIAL_CARD,
  I18nService,
  Item,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  MOCK_ITEM,
  MockTrackingService,
  PaymentService,
  TrackingService
} from 'shield';

import { ListComponent } from './list.component';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { Order } from '../../core/item/item-response.interface';
import { ORDER } from '../../../tests/item.fixtures';
import { UUID } from 'angular2-uuid';
import { CreditCardModalComponent } from './modals/credit-card-modal/credit-card-modal.component';
import { Subject } from 'rxjs/Subject';

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
  let componentInstance: any = {};
  let modalSpy: jasmine.Spy;
  const routerEvents: Subject<any> = new Subject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        I18nService,
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
          }
        }
        }, {
          provide: ErrorsService, useValue: {
            show() {
            }
          }
        }, {
          provide: Router, useValue: {
            navigate() {
            },
            events: routerEvents
          }
        }],
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
    trackingServiceSpy = spyOn(trackingService, 'track');
    itemerviceSpy = spyOn(itemService, 'mine').and.callThrough();
    modalSpy = spyOn(modalService, 'open').and.callThrough();
    spyOn(toastr, 'error');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should open modal', fakeAsync(() => {
      spyOn(router, 'navigate');
      component.ngOnInit();
      tick();
      expect(modalService.open).toHaveBeenCalledWith(BumpConfirmationModalComponent, {windowClass: 'review'})
      expect(router.navigate).toHaveBeenCalledWith(['catalog/list'])
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
  });

  describe('getItems', () => {
    it('should call mines with default values and set items', () => {
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
  });

  describe('filterByStatus', () => {
    beforeEach(() => {
      itemerviceSpy.calls.reset();
    });
    it('should call mines with filtering and reset page', () => {
      component['init'] = 20;
      component.filterByStatus('sold');
      expect(itemService.mine).toHaveBeenCalledWith(0, 'sold');
    });
    it('should not call mines if filter is the same', () => {
      component.selectedStatus = 'sold';
      component.filterByStatus('sold');
      expect(itemService.mine).not.toHaveBeenCalled();
    });
  });

  describe('loadMore', () => {
    it('should call mines with new page and append items', () => {
      component['init'] = 20;
      component.loadMore();
      expect(itemService.mine).toHaveBeenCalledWith(20, 'published');
      expect(component.items.length).toBe(4);
    });
  });

  describe('item changed', () => {
    const TOTAL: number = 5;
    let item: Item;
    beforeEach(() => {
      component.items = createItemsArray(TOTAL);
      item = component.items[3];
    });
    it('should remove item when deleted', () => {
      component.itemChanged({
        item: item,
        action: 'deleted'
      });
    });
    afterEach(() => {
      expect(component.items.length).toBe(TOTAL - 1);
      expect(_.find(component.items, {'id': item.id})).toBeFalsy();
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
    it('should call feature', () => {
      itemService.selectedAction = 'feature';
      spyOn(component, 'feature');
      const order: Order[] = [ORDER];
      component.onAction(order);
      expect(component.feature).toHaveBeenCalledWith(order);
    });
  });

  describe('delete', () => {
    const TOTAL: number = 5;
    beforeEach(() => {
      component.selectedStatus = 'active';
      component.items = createItemsArray(TOTAL);
    });
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
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
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkDelete').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.delete();
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been deleted due to an error');
      });
    });
  });

  describe('reserve', () => {
    const TOTAL = 5;
    describe('success', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE));
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
        expect(toastr.error).not.toHaveBeenCalled();
      });
    });
    describe('failed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'bulkReserve').and.returnValue(Observable.of(ITEMS_BULK_RESPONSE_FAILED));
        component.reserve();
        tick();
      }));
      it('should open error toastr', () => {
        expect(toastr.error).toHaveBeenCalledWith('Some listings have not been reserved due to an error');
      });
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
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
      });
      describe('without credit card', () => {
        beforeEach(() => {
          spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.throw(''));
          component.feature({
            order: [ORDER],
            total: 10
          });
        });
        it('should submit sabadell with orderId', () => {
          expect(eventId).toBe('UUID');
        });
      });
      describe('with credit card', () => {
        beforeEach(() => {
          spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.of(FINANCIAL_CARD));
        });
        describe('user wants new one', () => {
          beforeEach(fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.resolve('new'),
              componentInstance: componentInstance
            });
            component.feature({
              order: [ORDER],
              total: 10
            });
          }));
          it('should submit sabadell with orderId', () => {
            expect(eventId).toBe('UUID');
          });
        });
        describe('user wants old one', () => {
          beforeEach(fakeAsync(() => {
            modalSpy.and.returnValue({
              result: Promise.resolve('old'),
              componentInstance: componentInstance
            });
            spyOn(router, 'navigate');
          }));
          describe('payment ok', () => {
            beforeEach(fakeAsync(() => {
              spyOn(paymentService, 'pay').and.callThrough();
              spyOn(component, 'deselect');
              component.feature({
                order: [ORDER],
                total: 10
              });
              tick(1000);
            }));
            it('should redirect to code 200', () => {
              expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
            });
            it('should call deselect', () => {
              expect(component.deselect).toHaveBeenCalled();
            });
          });
          describe('payment ko', () => {
            beforeEach(fakeAsync(() => {
              spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));
              component.feature({
                order: [ORDER],
                total: 10
              });
            }));
            it('should redirect to code 400', () => {
              expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 400}]);
            });
          });
          afterEach(() => {
            it('should call pay', () => {
              expect(paymentService.pay).toHaveBeenCalledWith('UUID');
            });
          });
        });
        afterEach(() => {
          it('should open modal', () => {
            expect(modalService.open).toHaveBeenCalledWith(CreditCardModalComponent, {windowClass: 'credit-card'});
          });
          it('should set financialCard and total to componentInstance', () => {
            expect(componentInstance.financialCard).toEqual(FINANCIAL_CARD);
            expect(componentInstance.total).toBe(10);
          });
        });
      });
      afterEach(() => {
        it('should call purchaseProducts', () => {
          expect(itemService.purchaseProducts).toHaveBeenCalledWith([ORDER], 'UUID');
        });
        it('should call getFinancialCard', () => {
          expect(paymentService.getFinancialCard).toHaveBeenCalled();
        });
      });
    });
    describe('error', () => {
      beforeEach(() => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.throw(''));
        spyOn(component, 'deselect');
        component.feature({
          order: [ORDER],
          total: 10
        });
      });
      it('should call deselect', () => {
        expect(component.deselect).toHaveBeenCalled();
      });
      it('should call toastr', () => {
        expect(toastr.error).toHaveBeenCalled();
      });
    });

  });


});
