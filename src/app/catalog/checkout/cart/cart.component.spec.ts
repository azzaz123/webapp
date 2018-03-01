import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from './cart.service';
import { Observable } from 'rxjs/Observable';
import { Cart } from './cart';
import { CartChange } from './cart-item.interface';
import { FINANCIAL_CARD, ITEM_ID, MockTrackingService, PaymentService } from 'shield';
import { CART_ITEM_CITYBUMP, CART_ORDER, CART_ORDER_TRACK, MOCK_ITEM_V3 } from '../../../../tests/item.fixtures';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let itemService: ItemService;
  let errorService: ErrorsService;
  let paymentService: PaymentService;
  let router: Router;
  let trackingService: TrackingService;

  const CART = new Cart();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CartComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: CartService, useValue: {
          cart$: Observable.of(CART_CHANGE),
          remove() {
          },
          clean() {
          }
        }
        },
        {
          provide: ItemService, useValue: {
          purchaseProducts() {
            return Observable.of({});
          },
          deselectItems() {
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          show() {
          }
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
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.get(CartService);
    itemService = TestBed.get(ItemService);
    errorService = TestBed.get(ErrorsService);
    paymentService = TestBed.get(PaymentService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    spyOn(paymentService, 'getFinancialCard').and.returnValue(Observable.of(FINANCIAL_CARD));
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set cart', () => {
      expect(component.cart).toEqual(CART);
    });
    it('should set card', () => {
      expect(component.financialCard).toEqual(FINANCIAL_CARD);
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

    describe('success', () => {
      beforeEach(() => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.of([]));
        spyOn(component.cart, 'prepareOrder').and.returnValue(CART_ORDER);
        spyOn(component.cart, 'getOrderId').and.returnValue('UUID');
        spyOn(trackingService, 'track');
        eventId = null;
        component.sabadellSubmit.subscribe((id: string) => {
          eventId = id;
        });
      });

      describe('without credit card', () => {
        it('should submit sabadell with orderId', () => {
          component.financialCard = null;

          component.checkout();

          expect(eventId).toBe('UUID');
        });
      });

      describe('with credit card', () => {
        describe('user wants new one', () => {

          it('should submit sabadell with orderId', () => {
            component.cardType = 'new';

            component.checkout();

            expect(eventId).toBe('UUID');
          });
        });

        describe('user wants old one', () => {
          beforeEach(() => {
            spyOn(router, 'navigate');
          });

          describe('payment ok', () => {
            beforeEach(() => {
              spyOn(paymentService, 'pay').and.callThrough();
              spyOn(itemService, 'deselectItems');
              itemService.selectedAction = 'feature';

              component.checkout();
            });

            it('should redirect to code 200', () => {
              expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: 200}]);
            });

            it('should call deselectItems', () => {
              expect(itemService.deselectItems).toHaveBeenCalled();
              expect(itemService.selectedAction).toBeNull();
            });
          });

          describe('payment ko', () => {
            beforeEach(() => {
              spyOn(paymentService, 'pay').and.returnValue(Observable.throw(''));

              component.checkout();
            });

            it('should redirect to code -1', () => {
              expect(router.navigate).toHaveBeenCalledWith(['catalog/list', {code: -1}]);
            });
          });

          afterEach(() => {
            it('should call pay', () => {
              expect(paymentService.pay).toHaveBeenCalledWith('UUID');
            });
          });
        });
      });

      afterEach(() => {
        it('should call purchaseProducts', () => {
          expect(itemService.purchaseProducts).toHaveBeenCalledWith(CART_ORDER, 'UUID');
        });

        it('should call track', () => {
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {
            selected_products: CART_ORDER_TRACK
          });
        });
      });
    });

    describe('error', () => {
      it('should call toastr', () => {
        spyOn(itemService, 'purchaseProducts').and.returnValue(Observable.throw({
          text() {
            return '';
          }
        }));
        spyOn(errorService, 'i18nError');

        component.checkout();

        expect(errorService.i18nError).toHaveBeenCalledWith('bumpError');
      });
    });

  });
});
