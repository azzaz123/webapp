import { throwError, of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ItemService } from '@core/item/item.service';
import { StripeService } from '@core/stripe/stripe.service';
import { ITEM_ID, CART_ITEM_CITYBUMP, MOCK_ITEM_V3, CART_ORDER } from '@fixtures/item.fixtures.spec';
import { STRIPE_CARD_OPTION } from '@fixtures/stripe.fixtures.spec';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { Cart } from '@shared/catalog/cart/cart';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let errorService: ErrorsService;
  let router: Router;
  let eventService: EventService;
  let stripeService: StripeService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgbButtonsModule],
        declarations: [CartComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          EventService,
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
              purchaseProducts() {
                return of({});
              },
              deselectItems() {},
              purchaseProductsWithCredits() {
                return of({
                  payment_needed: true,
                });
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
              show() {},
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: StripeService,
            useValue: {
              buy() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    itemService = TestBed.inject(ItemService);
    errorService = TestBed.inject(ErrorsService);
    router = TestBed.inject(Router);
    eventService = TestBed.inject(EventService);
    stripeService = TestBed.inject(StripeService);
    component.creditInfo = {
      currencyName: 'wallacoins',
      credit: 200,
      factor: 100,
    };
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call createInstance cartService method', () => {
      spyOn(cartService, 'createInstance').and.callThrough();

      component.ngOnInit();

      expect(cartService.createInstance).toHaveBeenCalledWith(new Cart());
    });

    it('should set cart', () => {
      expect(component.cart).toEqual(CART);
    });
  });

  describe('hasCard', () => {
    it('should set true if stripe card exists', () => {
      component.hasCard(true);

      expect(component.hasSavedCard).toEqual(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(false);

      expect(component.addNewCard).toHaveBeenCalledTimes(1);
    });
  });

  describe('addNewCard', () => {
    it('should set showCard to true', () => {
      component.addNewCard();

      expect(component.showCard).toEqual(true);
    });
  });

  describe('setSavedCard', () => {
    it('should set showCard to false, savedCard to true and setCardInfo', () => {
      spyOn(component, 'setCardInfo').and.callThrough();

      component.setSavedCard(STRIPE_CARD_OPTION);

      expect(component.showCard).toEqual(false);
      expect(component.savedCard).toEqual(true);
      expect(component.setCardInfo).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set active false', () => {
      component.ngOnDestroy();

      expect(component['active']).toBeFalsy();
    });

    it('should call clean', () => {
      spyOn(cartService, 'clean');

      component.ngOnDestroy();

      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove', () => {
      const TYPE = 'citybump';
      spyOn(cartService, 'remove');

      component.remove(CART_ITEM_CITYBUMP, TYPE);

      expect(cartService.remove).toHaveBeenCalledWith(MOCK_ITEM_V3.id, TYPE);
    });
  });

  describe('clean', () => {
    it('should call clean', () => {
      spyOn(cartService, 'clean');

      component.clean();

      expect(cartService.clean).toHaveBeenCalled();
    });
  });

  describe('checkout', () => {
    let eventId: string;

    it('should not proceed if cart is empty or loading', () => {
      spyOn(itemService, 'purchaseProductsWithCredits').and.callThrough();

      component.cart = CART;
      component.cart.total = null;

      expect(itemService.purchaseProductsWithCredits).not.toHaveBeenCalled();
    });

    describe('success', () => {
      beforeEach(() => {
        spyOn(component.cart, 'prepareOrder').and.returnValue(CART_ORDER);
        spyOn(component.cart, 'getOrderId').and.returnValue('UUID');
        spyOn(localStorage, 'setItem');
        spyOn(eventService, 'emit');

        eventId = null;
        component.cart = CART;
        component.cart.total = 1;
        component.loading = false;
      });

      it('should set localStorage with transaction type', fakeAsync(() => {
        component.creditInfo.credit = 0;
        component.checkout();
        tick(2000);

        expect(localStorage.setItem).toHaveBeenCalledWith('transactionType', 'bump');
      }));

      it('should emit TOTAL_CREDITS_UPDATED event', fakeAsync(() => {
        component.checkout();
        tick(2000);

        expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED);
      }));

      describe('with payment_needed false', () => {
        beforeEach(() => {
          spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(
            of({
              payment_needed: false,
              items_failed: [],
            })
          );
          spyOn(itemService, 'deselectItems');
          spyOn(router, 'navigate');
          itemService.selectedAction = 'feature';
        });

        it('should redirect to code 200', fakeAsync(() => {
          component.checkout();
          tick(2000);

          expect(router.navigate).toHaveBeenCalledWith(['catalog/list', { code: 200 }]);
        }));

        it('should call deselectItems', fakeAsync(() => {
          component.checkout();
          tick(2000);

          expect(itemService.deselectItems).toHaveBeenCalled();
          expect(itemService.selectedAction).toBeNull();
        }));
      });
    });

    describe('error', () => {
      it('should call toastr', fakeAsync(() => {
        spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(
          throwError({
            text() {
              return '';
            },
          })
        );
        spyOn(errorService, 'i18nError');

        component.checkout();
        tick(2000);

        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.BUMP_ERROR);
      }));
    });
  });

  describe('totalToPay', () => {
    beforeEach(() => {
      component.cart = null;
    });

    it('should return 0 if no cart', () => {
      expect(component.totalToPay).toBe(0);
    });

    it('should return 0 if credits to pay < user credits', () => {
      component.cart = CART;
      CART.total = 1;

      expect(component.totalToPay).toBe(0);
    });

    it('should return the total to pay otherwise', () => {
      component.cart = CART;
      CART.total = 5;

      expect(component.totalToPay).toBe(3);
    });
  });

  describe('usedCredits', () => {
    beforeEach(() => {
      component.cart = null;
    });

    it('should return 0 if no cart', () => {
      expect(component.usedCredits).toBe(0);
    });

    it('should return -credits if credits to pay < user credits', () => {
      component.cart = CART;
      CART.total = 1;

      expect(component.usedCredits).toBe(-100);
    });

    it('should return -creditInfo.credit otherwise', () => {
      component.cart = CART;
      CART.total = 5;

      expect(component.usedCredits).toBe(-200);
    });
  });
});
