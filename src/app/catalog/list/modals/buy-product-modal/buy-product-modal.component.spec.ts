
import {of as observableOf,  Observable, throwError, Subject } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProductModalComponent } from './buy-product-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { MOCK_ITEM_V3, ORDER_EVENT } from '../../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../../core/item/item.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';
import { UUID } from 'angular2-uuid';
import { OrderEvent } from '../../selected-items/selected-product.interface';
import { StripeService } from '../../../../core/stripe/stripe.service';
import { Router } from '@angular/router';
import { STRIPE_CARD_OPTION } from '../../../../../tests/stripe.fixtures.spec';
import { ErrorsService } from '../../../../core/errors/errors.service';

describe('BuyProductModalComponent', () => {
  let component: BuyProductModalComponent;
  let fixture: ComponentFixture<BuyProductModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let paymentService: PaymentService;
  let eventService: EventService;
  let stripeService: StripeService;
  let errorService: ErrorsService;
  let router: Router;
  const routerEvents: Subject<any> = new Subject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyProductModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: ErrorsService, useValue: {
            i18nError() {
            },
            show() {
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            },
            events: routerEvents
          }
        },
        {
          provide: ItemService, useValue: {
            get() {
              return observableOf(MOCK_ITEM_V3);
            },
            purchaseProductsWithCredits() {
              return observableOf({
                payment_needed: true
              });
            }
          }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            },
            dismiss() {
            }
          }
        },
        {
          provide: PaymentService, useValue: {
            getCreditInfo() {
              return observableOf({});
            }
          }
        },
        {
          provide: StripeService, useValue: {
            buy() {},
            getCards() {
              return observableOf([]);
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyProductModalComponent);
    component = fixture.componentInstance;
    component.orderEvent = {...ORDER_EVENT} as OrderEvent;
    fixture.detectChanges();
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
    paymentService = TestBed.get(PaymentService);
    eventService = TestBed.get(EventService);
    stripeService = TestBed.get(StripeService);
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(itemService, 'get').and.callThrough();
    });

    it('should get and set item', () => {
      component.type = 'urgent';

      component.ngOnInit();

      expect(component.item).toEqual(MOCK_ITEM_V3);
      expect(component.item.urgent).toBe(true);
    });

    it('should call getCreditInfo and set it', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 2000,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(observableOf(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual(creditInfo);
    });

    it('should call getCreditInfo and set it with wallacredits if credit is 0', () => {
      const creditInfo: CreditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };
      spyOn(paymentService, 'getCreditInfo').and.returnValue(observableOf(creditInfo));

      component.ngOnInit();

      expect(component.creditInfo).toEqual({
        currencyName: 'wallacredits',
        credit: 0,
        factor: 1
      });
    });
  });

  describe('withCredits', () => {
    it('should return true if has wallacredits', () => {
      component.creditInfo = {
        currencyName: 'wallacredits',
        credit: 0,
        factor: 100
      };

      expect(component.withCredits).toBe(true);
    });

    it('should return false if has not wallacredits', () => {
      component.creditInfo = {
        currencyName: 'wallacoins',
        credit: 0,
        factor: 100
      };

      expect(component.withCredits).toBe(false);
    });
  });

  describe('totalToPay', () => {

    beforeEach(() => {
      component.creditInfo = {
        currencyName: 'wallacoins',
        credit: 200,
        factor: 100
      };
      component.orderEvent = {...ORDER_EVENT} as OrderEvent;
    });

    it('should return 0 if credits to pay < user credits', () => {
      component.orderEvent.total = 1;

      expect(component.totalToPay).toBe(0);
    });

    it('should return the total to pay otherwise', () => {
      component.orderEvent.total = 5;

      expect(component.totalToPay).toBe(3);
    });
  });

  describe('hasCard', () => {
    it('should set if stripeCard is present', () => {
      component.hasCard(true);

      expect(component.hasSavedCard).toBe(true);
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
    it('should set showCard and savedCard', () => {
      component.addNewCard();

      expect(component.showCard).toBe(true);
      expect(component.savedCard).toBe(false);
    });
  });

  describe('removeNewCard', () => {
    it('should set showCard and savedCard', () => {
      component.removeNewCard();

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
    });
  });

  describe('setSavedCard', () => {
      it('should set showCard and savedCard and call setCardInfo', () => {
        spyOn(component, 'setCardInfo').and.callThrough();
        component.setSavedCard(STRIPE_CARD_OPTION);

        expect(component.showCard).toBe(false);
        expect(component.savedCard).toBe(true);
        expect(component.selectedCard).toBe(true);
        expect(component.setCardInfo).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    });
  });

  describe('checkout', () => {
    let eventId: string;

    describe('success', () => {

      beforeEach(() => {
        spyOn(localStorage, 'setItem');
        spyOn(eventService, 'emit');
        spyOn(UUID, 'UUID').and.returnValue('UUID');
        spyOn(activeModal, 'close');
        eventId = null;
        component.creditInfo = {
          currencyName: 'wallacoins',
          credit: 200,
          factor: 100
        };
        component.orderEvent = {...ORDER_EVENT} as OrderEvent;
      });

      it('should set localStorage with transaction amount', () => {
        component.checkout();

        expect(localStorage.setItem).toHaveBeenCalledWith('transactionSpent', '200');
      });

      it('should emit TOTAL_CREDITS_UPDATED event', () => {
        component.checkout();

        expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED);
      });

      describe('with payment_needed true', () => {
        describe('with credit card', () => {
          describe('user wants new one', () => {
            it('should buy with stripe', () => {
              spyOn(stripeService, 'buy').and.callThrough();
              const orderId = 'UUID';
              const paymentId = 'UUID';
              component.savedCard = false;

              component.checkout();

              expect(stripeService.buy).toHaveBeenCalledWith(orderId, paymentId, component.hasSavedCard, component.savedCard, component.card);
            });
          });
        });
      });

      describe('error', () => {
        beforeEach(() => {
          spyOn(itemService, 'purchaseProductsWithCredits').and.returnValue(Observable.throwError(''));

          component.checkout();
        });

        it('should close with error', () => {
          expect(activeModal.close).toHaveBeenCalledWith('error');
        });

      });

    });
  });
});
