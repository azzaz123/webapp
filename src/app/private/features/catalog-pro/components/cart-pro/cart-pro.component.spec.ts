import { throwError, of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartProComponent } from './cart-pro.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@shared/catalog/cart/cart.service';
import { ErrorsService } from '@core/errors/errors.service';
import { ItemService } from '@core/item/item.service';
import { PaymentService } from '@core/payments/payment.service';
import { PerksModel } from '@core/payments/payment.model';
import { CartPro } from '@shared/catalog/cart/cart-pro';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { ScheduledStatus } from '@core/payments/payment.interface';
import { MOCK_PROITEM } from '@fixtures/pro-item.fixtures.spec';
import { OrderPro } from '@core/item/item-response.interface';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('CartProComponent', () => {
  let component: CartProComponent;
  let fixture: ComponentFixture<CartProComponent>;
  let cartService: CartService;
  let errorService: ErrorsService;
  let itemService: ItemService;
  let router: Router;
  let paymentsService: PaymentService;
  const perksModel: PerksModel = new PerksModel();
  perksModel.subscription.bump.quantity = 10;
  perksModel.extra.bump.quantity = 3;
  perksModel.subscription.national.quantity = 20;
  perksModel.extra.national.quantity = 4;

  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump',
  };

  const MOCK_STATUS: ScheduledStatus = {
    active: true,
    autorenew_alert: 0,
    autorenew_scheduled: { citybump: 16, countrybump: 21 },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [CartProComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: PaymentService,
            useValue: {
              getPerks() {
                return of(perksModel);
              },
              getStatus() {
                return of(MOCK_STATUS);
              },
            },
          },
          {
            provide: CartService,
            useValue: {
              cart$: of(CART_CHANGE),
              createInstance() {},
              remove() {},
              clean() {},
            },
          },
          {
            provide: ItemService,
            useValue: {
              bumpProItems() {
                return of({});
              },
              deselectItems() {},
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartProComponent);
    component = fixture.componentInstance;
    component.status = MOCK_STATUS;
    component.perks = perksModel;
    cartService = TestBed.inject(CartService);
    itemService = TestBed.inject(ItemService);
    errorService = TestBed.inject(ErrorsService);
    router = TestBed.inject(Router);
    paymentsService = TestBed.inject(PaymentService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new CartPro());
    });

    it('should get quantity of bumps', () => {
      spyOn(paymentsService, 'getPerks').and.callThrough();

      component.ngOnInit();

      expect(paymentsService.getPerks).toHaveBeenCalled();
      expect(component.perks).toEqual(perksModel);
    });

    it('should get quantity of bumps scheduled', () => {
      spyOn(paymentsService, 'getStatus').and.callThrough();

      component.ngOnInit();

      expect(paymentsService.getStatus).toHaveBeenCalled();
      expect(component.status).toEqual(MOCK_STATUS);
    });

    it('should calculate balance for city cart', () => {
      CART['citybump'].total = 10;
      component.ngOnInit();

      expect(component.balance['citybump']).toBe(-13);
    });

    it('should calculate balance for country cart', () => {
      CART['countrybump'].total = 10;
      component.ngOnInit();

      expect(component.balance['countrybump']).toBe(-7);
    });
  });

  describe('remove', () => {
    it('should call remove', () => {
      spyOn(cartService, 'remove');

      component.remove(MOCK_PROITEM);

      expect(cartService.remove).toHaveBeenCalledWith(MOCK_PROITEM.item.id, MOCK_PROITEM.bumpType);
    });
  });

  describe('clean', () => {
    it('should call clean', () => {
      spyOn(cartService, 'clean');

      component.clean();

      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('applyBumps', () => {
    it('should prepare the order', () => {
      spyOn(itemService, 'bumpProItems').and.returnValue(of([]));
      const order: OrderPro[] = component.cart.prepareOrder();

      component.applyBumps();

      expect(itemService.bumpProItems).toHaveBeenCalledWith(order);
    });

    describe('success', () => {
      beforeEach(() => {
        spyOn(itemService, 'bumpProItems').and.returnValue(of([]));
        spyOn(itemService, 'deselectItems').and.callThrough();
        spyOn(errorService, 'i18nError');
        spyOn(router, 'navigate');
        component.cart.countrybump.total = 0;
        component.cart.citybump.total = 0;

        component.applyBumps();
      });

      it('should deselect items', () => {
        expect(itemService.deselectItems).toHaveBeenCalled();
      });

      it('should navigate to pro list', () => {
        expect(router.navigate).toHaveBeenCalledWith(['/pro/catalog/list', { code: 201 }]);
        expect(errorService.i18nError).not.toHaveBeenCalled();
      });
    });

    describe('success with no balance', () => {
      beforeEach(() => {
        spyOn(errorService, 'i18nError');
        spyOn(router, 'navigate');
      });

      it('should navigate to pro list if no citybump balance', () => {
        component.cart.citybump.total = 1;
        component.balance.countrybump = -1;

        component.applyBumps();

        expect(router.navigate).toHaveBeenCalledWith(['/pro/catalog/list', { code: 202 }]);
        expect(errorService.i18nError).not.toHaveBeenCalled();
      });

      it('should navigate to pro list if no countrybump balance', () => {
        component.cart.countrybump.total = 1;
        component.balance.countrybump = -1;

        component.applyBumps();

        expect(router.navigate).toHaveBeenCalledWith(['/pro/catalog/list', { code: 202 }]);
        expect(errorService.i18nError).not.toHaveBeenCalled();
      });
    });

    describe('error', () => {
      beforeEach(() => {
        spyOn(errorService, 'i18nError');
        spyOn(router, 'navigate');
      });

      it('should thrown bumpError if failedProducts', () => {
        const failedProducts: string = MOCK_PROITEM.item.id;
        spyOn(itemService, 'bumpProItems').and.returnValue(of(failedProducts));

        component.applyBumps();

        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.BUMP_ERROR);
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should thrown bumpError if operation not succeed and text have value', () => {
        spyOn(itemService, 'bumpProItems').and.returnValue(
          throwError({
            text() {
              return '';
            },
          })
        );

        component.applyBumps();

        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.BUMP_ERROR);
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
