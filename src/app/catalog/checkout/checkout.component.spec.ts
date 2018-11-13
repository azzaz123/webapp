import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ITEM_ID, ITEMS_WITH_PRODUCTS, ITEMS_WITH_PRODUCTS_PROVINCE } from '../../../tests/item.fixtures.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/payments/payment.service';
import { CreditInfo } from '../../core/payments/payment.interface';
import { environment } from '../../../environments/environment';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let router: Router;
  let paymentService: PaymentService;
  let spyCall;
  let route: ActivatedRoute;

  const SELECTED_ITEMS = ['1', '2', '3'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems: SELECTED_ITEMS,
          getItemsWithAvailableProducts() {
            return Observable.of(ITEMS_WITH_PRODUCTS);
          }
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return Observable.of({});
          }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({})
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    router = TestBed.get(Router);
    paymentService = TestBed.get(PaymentService);
    route = TestBed.get(ActivatedRoute);
    spyCall = spyOn(itemService, 'getItemsWithAvailableProducts').and.callThrough();
    appboy.initialize(environment.appboy);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should send appboy FeatureItems event', () => {
      spyOn(appboy, 'logCustomEvent');

      component.ngOnInit();

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('FeatureItems', {platform: 'web'});
    });

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
        spyCall.and.returnValue(Observable.of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBe(true);
      });
    });

    describe('with params', () => {

      beforeEach(() => {
        route.params = Observable.of({
          itemId: ITEM_ID
        });
      });

      it('should call getItemsWithAvailableProducts and set it', () => {
        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should set provincialBump to true if no citybump', () => {
        spyCall.and.returnValue(Observable.of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBe(true);
      });

      it('should redirect if no products available', () => {
        spyCall.and.returnValue(Observable.of([]));
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', {alreadyFeatured: true}])
      });
    });

    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });

    it('should call getCreditInfo and set it with wallacredits if credit is 0', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(Observable.of(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1
      });
    });
  });
});
