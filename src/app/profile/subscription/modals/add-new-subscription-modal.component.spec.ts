import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AddNewSubscriptionModalComponent } from './add-new-subscription-modal.component';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { AccessTokenService } from '../../../core/http/access-token.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_REQUIRES_ACTION, SUBSCRIPTION_REQUIRES_PAYMENT, SUBSCRIPTION_SUCCESS } from '../../../../tests/subscription.fixtures.spec';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';

fdescribe('AddNewSubscriptionModalComponent', () => {
  let component: AddNewSubscriptionModalComponent;
  let fixture: ComponentFixture<AddNewSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  let event: EventService;
  let errorsService: ErrorsService;
  let stripeService: StripeService;
  let subscriptionsService: SubscriptionsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSubscriptionModalComponent],
      providers: [
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
            isPaymentMethodStripe$() {
              return Observable.of(true);
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            newSubscription() {
              return Observable.of(202);
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
          open() {}
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
    fixture.detectChanges();
    activeModal = TestBed.get(NgbActiveModal);
    modalService = TestBed.get(NgbModal);
    stripeService = TestBed.get(StripeService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    errorsService = TestBed.get(ErrorsService);
    event = TestBed.get(EventService);
  });

  describe('ngOnInit', () => {
    it('should call stripeService.isPaymentMethodStripe$', () => {
      spyOn(stripeService, 'isPaymentMethodStripe$').and.callThrough();

      component.ngOnInit();

      expect(stripeService.isPaymentMethodStripe$).toHaveBeenCalled();
    });

    it('should set isStripe to the value returned by stripeService.isPaymentMethodStripe$', () => {
      const expectedValue = true;
      spyOn(stripeService, 'isPaymentMethodStripe$').and.returnValue(Observable.of(expectedValue));

      component.ngOnInit();

      expect(component.isStripe).toBe(expectedValue);
    });

    it('should set current slide to ngb-slide-0', () => {
      component.ngOnInit();

      expect(component.currentSlide).toEqual('ngb-slide-0');
    })

  });

  describe('addSubscription', () => {
    const paymentMethodId = 'pm_a1b2c3d4';

    it('should set loading to true', () => {
      component.addSubscription(paymentMethodId);

      expect(component.currentSlide).toEqual('ngb-slide-0');
    })

    it('should requestNewPayment if card is not attached', fakeAsync(() => {
      spyOn(stripeService, 'addNewCard').and.returnValue(Observable.of(null));
      spyOn(errorsService, 'i18nError');

      component.addSubscription(paymentMethodId);
      tick();

      expect(component.loading).toBe(false);
      expect(component.isPaymentError).toBe(true);
      expect(component.action).toBe('clear');
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailed');
    }));

    it('should retrySubscription if it is isRetryInvoice', fakeAsync(() => {
      spyOn(subscriptionsService, 'retrySubscription').and.returnValue(Observable.of(null));
      spyOn(errorsService, 'i18nError');

      component.isRetryInvoice = true;
      component.addSubscription(paymentMethodId);
      tick();

      expect(subscriptionsService.retrySubscription).toHaveBeenCalled();
    }));

    it('should addSubscriptionFromSavedCard card is attached and it is no retry', fakeAsync(() => {
      spyOn(stripeService, 'addNewCard').and.returnValue(Observable.of(null));
      spyOn(errorsService, 'i18nError');

      component.isRetryInvoice = false;
      component.addSubscription(paymentMethodId);
      tick();

      expect(component.addSubscriptionFromSavedCard).toHaveBeenCalled();

    }));
  });

  describe('addSubscriptionFromSavedCard', () => {
    const paymentMethodId = 'pm_a1b2c3d4';

    it('should set loading to true if it is false', () => {
      component.loading = false;

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(component.loading).toBe(true);
    })

    it('should not update loading if it is true', () => {
      component.loading = true;

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(component.loading).toBe(true);
    })

    it('should call retrySubscription if isRetryInvoice', () => {
      component.isRetryInvoice = true;

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(subscriptionsService.retrySubscription).toHaveBeenCalled();
    })

    it('should call newSubscription if is not retryInvoice', () => {
      component.isRetryInvoice = false;

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(subscriptionsService.newSubscription).toHaveBeenCalled();
    });

    it('should call checkNewSubscriptionStatus if response is 202', () => {
      component.isRetryInvoice = false;
      spyOn(subscriptionsService, 'newSubscription').and.callThrough();

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(subscriptionsService.checkNewSubscriptionStatus).toHaveBeenCalled();
    });

    it('should show success modal if response status is succeeded', () => {
      component.isRetryInvoice = false;
      spyOn(subscriptionsService, 'newSubscription').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.callThrough();
      spyOn(modalService, 'open');

      component.addSubscriptionFromSavedCard(paymentMethodId);
      
      expect(component.isRetryInvoice).toBe(false);
      expect(modalService.open).toHaveBeenCalledWith(PaymentSuccessModalComponent, {windowClass: 'success'});
    });

    it('should call actionPayment if response status is requires_action', () => {
      component.isRetryInvoice = false;
      spyOn(subscriptionsService, 'newSubscription').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_ACTION));

      component.addSubscriptionFromSavedCard(paymentMethodId);
      
      expect(stripeService.actionPayment).toHaveBeenCalledWith(SUBSCRIPTION_REQUIRES_ACTION.payment_secret_key);
    });

    it('should call requestNewPayment if response status is requires_action', () => {
      component.isRetryInvoice = false;
      spyOn(subscriptionsService, 'newSubscription').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_PAYMENT));

      component.addSubscriptionFromSavedCard(paymentMethodId);

      expect(component.isRetryInvoice).toBe(false);
    });
  });

});