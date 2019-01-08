import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProComponent } from './cart-pro.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { PerksModel } from '../../../core/payments/payment.model';
import { CartPro } from '../../../shared/catalog/cart/cart-pro';
import { CartChange } from '../../../shared/catalog/cart/cart-item.interface';
import { ITEM_ID } from '../../../../tests/item.fixtures.spec';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { MOCK_PROITEM } from '../../../../tests/pro-item.fixtures.spec';
import { OrderPro } from '../../../core/item/item-response.interface';

describe('CartProComponent', () => {
  let component: CartProComponent;
  let fixture: ComponentFixture<CartProComponent>;
  let cartService: CartService;
  let errorService: ErrorsService;
  let itemService: ItemService;
  let router: Router;
  let trackingService: TrackingService;
  let paymentsService: PaymentService;
  const perksModel: PerksModel = new PerksModel();

  const CART = new CartPro();
  const CART_CHANGE: CartChange = {
    action: 'add',
    cart: CART,
    itemId: ITEM_ID,
    type: 'citybump'
  };

  const MOCK_STATUS: ScheduledStatus = {
    active: true,
    autorenew_alert: 0,
    autorenew_scheduled: { citybump: 16, countrybump: 21 }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CartProComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: PaymentService, useValue: {
            getPerks() {
              return Observable.of(perksModel);
            },
            getStatus() {
              return Observable.of(MOCK_STATUS);
            }
          }
        },
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: CartService, useValue: {
            cart$: Observable.of(CART_CHANGE),
            createInstance() {
            },
            remove() {
            },
            clean() {
            }
          }
        },
        {
          provide: ItemService, useValue: {
            bumpProItems() {
              return Observable.of({});
            },
            deselectItems() {
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            i18nError() {
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartProComponent);
    component = fixture.componentInstance;
    component.status = MOCK_STATUS;
    component.perks = perksModel;
    cartService = TestBed.get(CartService);
    itemService = TestBed.get(ItemService);
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    paymentsService = TestBed.get(PaymentService);
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
      component.ngOnInit();

      expect(component.balance['citybump']).toBe(-16);
    });

    it('should calculate balance for country cart', () => {
      component.ngOnInit();

      expect(component.balance['countrybump']).toBe(-21);
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
      spyOn(itemService, 'bumpProItems').and.returnValue(Observable.of([]));
      const order: OrderPro[] = component.cart.prepareOrder();

      component.applyBumps();

      expect(itemService.bumpProItems).toHaveBeenCalledWith(order);
    });

    describe('success', () => {
      beforeEach(() => {
        spyOn(itemService, 'bumpProItems').and.returnValue(Observable.of([]));
        spyOn(itemService, 'deselectItems').and.callThrough();
        spyOn(errorService, 'i18nError');
        spyOn(router, 'navigate');
        spyOn(trackingService, 'track');
        component.applyBumps();
      });

      it('should deselect items', () => {
        expect(itemService.deselectItems).toHaveBeenCalled();
      });

      it('should track', () => {
        const order: OrderPro[] = component.cart.prepareOrder();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.BUMP_PRO_APPLY, {
          selected_products: order
        });
      });

      it('should navigate to pro list', () => {
        expect(router.navigate).toHaveBeenCalledWith(['/pro/catalog/list', { code: 201 }]);
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
        spyOn(itemService, 'bumpProItems').and.returnValue(Observable.of(failedProducts));

        component.applyBumps();

        expect(errorService.i18nError).toHaveBeenCalledWith('bumpError');
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should thrown bumpError if operation not succeed and text have value', () => {
        spyOn(itemService, 'bumpProItems').and.returnValue(Observable.throw({
          text() {
            return '';
          }
        }));

        component.applyBumps();

        expect(errorService.i18nError).toHaveBeenCalledWith('bumpError');
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
