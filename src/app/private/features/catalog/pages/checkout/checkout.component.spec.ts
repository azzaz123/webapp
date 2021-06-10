import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { ITEMS_WITH_PRODUCTS, ITEMS_WITH_PRODUCTS_PROVINCE, ITEM_ID } from '@fixtures/item.fixtures.spec';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let router: Router;
  let paymentService: PaymentService;
  let spyCall;
  let route: ActivatedRoute;

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
              getItemsWithAvailableProducts() {
                return of(ITEMS_WITH_PRODUCTS);
              },
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
    spyCall = spyOn(itemService, 'getItemsWithAvailableProducts').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    describe('no params', () => {
      it('should call getItemsWithAvailableProducts and set it', () => {
        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith(SELECTED_ITEMS);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should redirect to catalog if no item selected', () => {
        spyOn(router, 'navigate');
        itemService.selectedItems = [];

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
      });

      it('should set provincialBump to true if no citybump', () => {
        spyCall.and.returnValue(of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBe(true);
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

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should set provincialBump to true if no citybump', () => {
        spyCall.and.returnValue(of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBe(true);
      });

      it('should redirect if no products available', () => {
        spyCall.and.returnValue(of([]));
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
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
