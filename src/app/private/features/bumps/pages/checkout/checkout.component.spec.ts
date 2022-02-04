import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { ITEMS_WITH_AVAILABLE_PRODUCTS_MAPPED } from '@fixtures/bump-package.fixtures.spec';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let router: Router;
  let paymentService: PaymentService;
  let spyCall;
  let route: ActivatedRoute;
  let visibilityService: VisibilityApiService;

  const SELECTED_ITEMS = ['1', '2', '3'];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
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
});
