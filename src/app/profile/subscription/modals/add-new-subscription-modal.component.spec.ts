import { async, ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { AddNewSubscriptionModalComponent } from './add-new-subscription-modal.component';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import {
  SUBSCRIPTION_REQUIRES_ACTION,
  SUBSCRIPTION_REQUIRES_PAYMENT,
  SUBSCRIPTION_SUCCESS,
  TIER,
  MAPPED_SUBSCRIPTIONS
} from '../../../../tests/subscriptions.fixtures.spec';
import { STRIPE_CARD, FINANCIAL_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { PAYMENT_METHOD_DATA } from '../../../../tests/payments.fixtures.spec';

describe('AddNewSubscriptionModalComponent', () => {
  let component: AddNewSubscriptionModalComponent;
  let fixture: ComponentFixture<AddNewSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  let errorsService: ErrorsService;
  let stripeService: StripeService;
  let subscriptionsService: SubscriptionsService;
  const componentInstance = {
    subscription: MAPPED_SUBSCRIPTIONS[2]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSubscriptionModalComponent],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            i18nError() {}
          }
        },
        {
          provide: StripeService, useValue: {
            addNewCard() {
              return Observable.of(200);
            },
            actionPayment() {}
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            newSubscription() {
              return Observable.of({});
            },
            checkNewSubscriptionStatus() {
              return Observable.of(SUBSCRIPTION_SUCCESS);
            },
            retrySubscription() {
              return Observable.of('');
            },
            checkRetrySubscriptionStatus() {
              return Observable.of('');
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
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
    modalService = TestBed.get(NgbModal);
    stripeService = TestBed.get(StripeService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    errorsService = TestBed.get(ErrorsService);
    event = TestBed.get(EventService);
    component.card = STRIPE_CARD;
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    fixture.detectChanges();
  });

  describe('close', () => {
    it('shoud close the active modal', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalledWith('add');
    });
  });

  describe('addSubscription', () => {
    it('should set loading to true', () => {
      component.addSubscription(PAYMENT_METHOD_DATA);

      expect(component.loading).toBe(true);
    })

    it('should requestNewPayment if card is not attached', fakeAsync(() => {
      spyOn(stripeService, 'addNewCard').and.returnValue(Observable.of(null));
      spyOn(errorsService, 'i18nError');

      component.addSubscription(PAYMENT_METHOD_DATA);

      expect(component.loading).toBe(false);
      expect(component.isPaymentError).toBe(true);
      expect(component.action).toBe('clear');
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailed');
    }));

    it('should call addSubscriptionFromSavedCard if card is attached and it is no retry', fakeAsync(() => {
      component.isRetryInvoice = false;
      component.card = STRIPE_CARD;

      spyOn(stripeService, 'addNewCard').and.returnValue(Observable.of(200));
      spyOn(component, 'addSubscriptionFromSavedCard').and.callThrough();

      component.addSubscription(PAYMENT_METHOD_DATA);
      expect(component.addSubscriptionFromSavedCard).toHaveBeenCalled();
    }));
  });

  describe('addSubscriptionFromSavedCard', () => {
    beforeEach(fakeAsync(() => {
      spyOn(subscriptionsService, 'newSubscription').and.returnValue(Observable.of({status: 202}));
      
      component.isRetryInvoice = false;
    }));

    it('should update loading to false', fakeAsync(() => {
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.loading).toBe(false);
    }));

    it('should call newSubscription if is not retryInvoice', fakeAsync(() => {
      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(subscriptionsService.newSubscription).toHaveBeenCalled();
    }));

    it('should call checkNewSubscriptionStatus if response is 202', fakeAsync(() => {
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();
      
      expect(subscriptionsService.checkNewSubscriptionStatus).toHaveBeenCalled();
    }));

    it('should close the actual modal if response status is succeeded', fakeAsync(() => {
      spyOn(component, 'close');
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.isRetryInvoice).toBe(false);
      expect(component.close).toHaveBeenCalled();
    }));

    it('should show success modal if response status is succeeded', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.isRetryInvoice).toBe(false);
      expect(modalService.open).toHaveBeenCalledWith(PaymentSuccessModalComponent, {windowClass: 'success'});
    }));

    it('should call actionPayment if response status is requires_action', fakeAsync(() => {
      spyOn(stripeService, 'actionPayment').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_ACTION));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();
      
      expect(stripeService.actionPayment).toHaveBeenCalledWith(SUBSCRIPTION_REQUIRES_ACTION.payment_secret_key);
    }));

    it('should call requestNewPayment if response status is requires_payment_method', fakeAsync(() => {
      spyOn(errorsService, 'i18nError');
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_PAYMENT));
      
      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.loading).toBe(false);
      expect(component.isPaymentError).toBe(true);
      expect(component.action).toBe('clear');
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailed');

    }));
  });

  describe('setCardInfo', () => {
    it('should set the card info', ()=> {
      component.setCardInfo(STRIPE_CARD);

      expect(component.card).toEqual(STRIPE_CARD);
    });
  });

  describe('hasStripeCard', () => {
    it('should not call addNewCard if hasCard is true', () => {
      spyOn(component, 'addNewCard').and.callThrough();
      component.hasStripeCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if hasCard is false', () => {
      spyOn(component, 'addNewCard').and.callThrough();
      component.hasStripeCard(false);

      expect(component.addNewCard).toHaveBeenCalled();
    });
  });

  describe('addNewCard', () => {
    it('should show the new card element', ()=> {
      component.addNewCard();

      expect(component.showCard).toBe(true);
      expect(component.savedCard).toBe(false);
    });
  });

  describe('removeNewCard', () => {
    it('should show the saved card element', ()=> {
      component.removeNewCard();

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
    });
  });

  describe('setSavedCard', () => {
    it('should set the card info', () => {
      spyOn(component, 'setCardInfo').and.callThrough();
      component.setSavedCard(FINANCIAL_CARD_OPTION[0]);

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
      expect(component.selectedCard).toBe(true);
      expect(component.setCardInfo).toHaveBeenCalledWith(FINANCIAL_CARD_OPTION[0]);
    });
  });

  describe('selectListingLimit', () => {
    it('should set the listing limit', () => {
      component.selectListingLimit(TIER);

      expect(component.selectedTier).toBe(TIER);
    });
  });

});