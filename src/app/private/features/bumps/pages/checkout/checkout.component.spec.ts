import { of } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { UserService } from '@core/user/user.service';
import { MockUserService } from '@fixtures/user.fixtures.spec';
import {
  MOCK_ERROR_FREE_BUMP_GENERIC,
  MOCK_ERROR_FREE_BUMP_LIMITED_REACHED,
  MOCK_ERROR_FREE_BUMP_NOT_FOUND,
  MOCK_ERROR_FREE_NOT_MAPPED,
  MOCK_ERROR_STRIPE,
  MOCK_ITEMS_TO_BUY_FREE,
} from '@fixtures/visibility.fixtures.spec';
import { ProModalConfig } from '@shared/modals/pro-modal/pro-modal.interface';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let router: Router;
  let paymentService: PaymentService;
  let spyCall;
  let route: ActivatedRoute;
  let visibilityService: VisibilityApiService;
  let modalService: NgbModal;
  let componentInstance: any = {};

  const SELECTED_ITEMS = ['1', '2', '3'];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              deselectItems() {},
              selectedItems: SELECTED_ITEMS,
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: PaymentService,
            useValue: {
              getCreditInfo() {
                return of({});
              },
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({}),
              snapshot: {
                paramMap: {
                  get: () => 'item_id',
                },
              },
            },
          },
          {
            provide: VisibilityApiService,
            useValue: {
              getItemsWithProductsAndSubscriptionBumps() {
                return of(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED);
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
            useValue: MockUserService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    router = TestBed.inject(Router);
    paymentService = TestBed.inject(PaymentService);
    route = TestBed.inject(ActivatedRoute);
    visibilityService = TestBed.inject(VisibilityApiService);
    spyCall = spyOn(visibilityService, 'getItemsWithProductsAndSubscriptionBumps').and.callThrough();
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    describe('no params', () => {
      it('should call getItemsWithAvailableProducts and set it', () => {
        expect(visibilityService.getItemsWithProductsAndSubscriptionBumps).toHaveBeenCalledWith(SELECTED_ITEMS);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED);
      });

      it('should redirect to catalog if no item selected', () => {
        spyOn(router, 'navigate');
        itemService.selectedItems = [];

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
      });
    });

    describe('with params', () => {
      beforeEach(() => {
        route.params = of({
          itemId: ITEM_ID,
        });
      });

      it('should call getItemsWithAvailableProducts and set it', () => {
        component.ngOnInit();

        expect(visibilityService.getItemsWithProductsAndSubscriptionBumps).toHaveBeenCalledWith([ITEM_ID]);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED);
      });

      it('should redirect if no products available', () => {
        spyCall.and.returnValue(of([]));
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(visibilityService.getItemsWithProductsAndSubscriptionBumps).toHaveBeenCalledWith([ITEM_ID]);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', { alreadyFeatured: true }]);
      });
    });

    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100,
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });

    it('should call getCreditInfo and set it with wallacredits if credit is 0', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100,
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1,
      });
    });
  });

  describe('Confirm action', () => {
    let spyModal: jasmine.Spy;
    beforeEach(() => {
      spyModal = spyOn(modalService, 'open').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();
      spyOn(itemService, 'deselectItems').and.callThrough();
      component['modalRef'] = <any>{
        componentInstance: componentInstance,
      };
      itemService.selectedAction = 'feature';
    });

    describe('Modal', () => {
      beforeEach(() => {
        component.onConfirm();
      });
      it('should open modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_success]);
      });

      describe('and accept modal', () => {
        it('should navigate to catalog', () => {
          expect(router.navigate).toBeCalledTimes(1);
          expect(router.navigate).toBeCalledWith(['catalog/list']);
        });
      });

      describe('and dismiss modal', () => {
        beforeEach(() => {
          spyModal.and.returnValue({ result: Promise.reject(), componentInstance });
        });
        it('should navigate to catalog', () => {
          expect(router.navigate).toBeCalledTimes(1);
          expect(router.navigate).toBeCalledWith(['catalog/list']);
        });
      });
    });

    describe('Plural modal', () => {
      beforeEach(() => {
        component.itemsSelected = MOCK_ITEMS_TO_BUY_FREE;
        component.onConfirm();
      });
      it('should open modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_success_plural]);
      });
    });

    it('should call deselectItems', fakeAsync(() => {
      component.onConfirm();
      tick();

      expect(itemService.deselectItems).toHaveBeenCalled();
      expect(itemService.selectedAction).toBeNull();
    }));
  });

  describe('Error action', () => {
    let spyModal: jasmine.Spy;
    beforeEach(() => {
      spyModal = spyOn(modalService, 'open').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();
      spyOn(itemService, 'deselectItems').and.callThrough();
      component['modalRef'] = <any>{
        componentInstance: componentInstance,
      };
      itemService.selectedAction = 'feature';
    });

    it('should not redirect', () => {
      component.onError([MOCK_ERROR_FREE_BUMP_LIMITED_REACHED]);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    describe('reload data', () => {
      beforeEach(() => {
        spyOn(paymentService, 'getCreditInfo').and.callThrough();
        component.itemsSelected = MOCK_ITEMS_TO_BUY_FREE;
        component.onError([MOCK_ERROR_FREE_BUMP_LIMITED_REACHED]);
      });
      it('should clear data', () => {
        component.itemsSelected = [];
      });
      it('should reload items', () => {
        expect(visibilityService.getItemsWithProductsAndSubscriptionBumps).toHaveBeenCalledWith(['item_id']);
      });
      it('should reload credit info', fakeAsync(() => {
        expect(paymentService.getCreditInfo).toHaveBeenCalledTimes(1);
        expect(paymentService.getCreditInfo).toHaveBeenCalledWith(false);
      }));
    });

    describe('and has a single error', () => {
      describe('and is free bump error', () => {
        describe('and is limit reached error', () => {
          beforeEach(() => {
            component.onError([MOCK_ERROR_FREE_BUMP_LIMITED_REACHED]);
          });
          it('should show error', () => {
            expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
              windowClass: 'pro-modal',
            });
            expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_limit_reached]);
          });
        });
        describe('and is not found id error', () => {
          beforeEach(() => {
            component.onError([MOCK_ERROR_FREE_BUMP_NOT_FOUND]);
          });
          it('should show error', () => {
            expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
              windowClass: 'pro-modal',
            });
            expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_not_found]);
          });
        });
        describe('and is generic error', () => {
          beforeEach(() => {
            component.onError([MOCK_ERROR_FREE_BUMP_GENERIC]);
          });
          it('should show error', () => {
            expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
              windowClass: 'pro-modal',
            });
            expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_generic]);
          });
        });
        describe('and is not mapped error', () => {
          beforeEach(() => {
            component.onError([MOCK_ERROR_FREE_NOT_MAPPED]);
          });
          it('should show error', () => {
            expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
              windowClass: 'pro-modal',
            });
            expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_generic]);
          });
        });
      });

      describe('and is stripe bump error', () => {
        beforeEach(() => {
          component.onError([MOCK_ERROR_STRIPE]);
        });
        it('should show error', () => {
          expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
            windowClass: 'pro-modal',
          });
          expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_generic]);
        });
      });
    });

    describe('and has a multiple error', () => {
      beforeEach(() => {
        component.onError([MOCK_ERROR_FREE_BUMP_LIMITED_REACHED, MOCK_ERROR_STRIPE]);
      });
      it('should show error', () => {
        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        const currentModalConfig: ProModalConfig = component['modalRef'].componentInstance.modalConfig;
        expect(currentModalConfig.title).toBe(modalConfig[PRO_MODAL_TYPE.bump_error_generic].title);
      });
    });

    xdescribe('Modal', () => {
      beforeEach(() => {});
      it('should open modal', () => {});

      describe('and accept modal', () => {
        it('should navigate to catalog', () => {
          expect(router.navigate).toBeCalledTimes(1);
          expect(router.navigate).toBeCalledWith(['catalog/list']);
        });
      });

      describe('and dismiss modal', () => {
        beforeEach(() => {
          spyModal.and.returnValue({ result: Promise.reject(), componentInstance });
        });
        it('should navigate to catalog', () => {
          expect(router.navigate).toBeCalledTimes(1);
          expect(router.navigate).toBeCalledWith(['catalog/list']);
        });
      });
    });
  });
});
