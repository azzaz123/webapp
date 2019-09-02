import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AddNewSubscriptionModalComponent } from './add-new-subscription-modal.component';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventService } from '../../../core/event/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SUBSCRIPTION_REQUIRES_ACTION, SUBSCRIPTION_REQUIRES_PAYMENT, SUBSCRIPTION_SUCCESS } from '../../../../tests/subscriptions.fixtures.spec';
import { STRIPE_CARD, FINANCIAL_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import { UserService } from '../../../core/user/user.service';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { FeatureflagService } from '../../../core/user/featureflag.service';
import { PAYMENT_METHOD_DATA } from '../../../../tests/payments.fixtures.spec';

describe('AddNewSubscriptionModalComponent', () => {
  let component: AddNewSubscriptionModalComponent;
  let fixture: ComponentFixture<AddNewSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  let event: EventService;
  let errorsService: ErrorsService;
  let stripeService: StripeService;
  let subscriptionsService: SubscriptionsService;
  let userService: UserService;
  let featureflagService: FeatureflagService;

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
            isPaymentMethodStripe$() {
              return Observable.of(true);
            },
            addNewCard() {
              return Observable.of(200);
            },
            actionPayment() {}
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
          provide: UserService, useValue: {
            hasPerm() {
              return Observable.of(true);
            },
            me() {
              return Observable.of(MOCK_USER);
            }
          }
        },
          { provide: FeatureflagService, useValue: {
            getFlag() {
              return Observable.of(false);
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
    userService = TestBed.get(UserService);
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

    it('should set loading to true', () => {
      component.addSubscription(PAYMENT_METHOD_DATA);

      expect(component.currentSlide).toEqual('ngb-slide-0');
    })

    it('should requestNewPayment if card is not attached', fakeAsync(() => {
      spyOn(stripeService, 'addNewCard').and.returnValue(Observable.of(null));
      spyOn(errorsService, 'i18nError');

      component.addSubscription(PAYMENT_METHOD_DATA);
      tick();

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
      tick();

      expect(component.addSubscriptionFromSavedCard).toHaveBeenCalled();
    }));
  });

  describe('addSubscriptionFromSavedCard', () => {
    beforeEach(() => {
      component.card = STRIPE_CARD;
      component.loading = false;
    });
    
    it('should set loading to true if it is false', () => {
      component.loading = false;

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);

      expect(component.loading).toBe(true);
    })

    it('should not update loading if it is true', () => {
      component.loading = true;

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);

      expect(component.loading).toBe(true);
    })

    it('should call newSubscription if is not retryInvoice', () => {
      component.isRetryInvoice = false;

      spyOn(subscriptionsService, 'newSubscription').and.callThrough();

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);

      expect(subscriptionsService.newSubscription).toHaveBeenCalled();
    });

    it('should call checkNewSubscriptionStatus if response is 202', () => {
      component.isRetryInvoice = false;
      spyOn(subscriptionsService, 'newSubscription').and.returnValue(Observable.of({response: { status: 202}}));
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.callThrough();

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);

      expect(subscriptionsService.checkNewSubscriptionStatus).toHaveBeenCalled();
    });

    it('should show success modal if response status is succeeded', () => {
      component.isRetryInvoice = false;
      spyOn(modalService, 'open');
      spyOn(subscriptionsService, 'newSubscription').and.returnValue(Observable.of({response: { status: 202}}));
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      
      expect(component.isRetryInvoice).toBe(false);
      expect(modalService.open).toHaveBeenCalledWith(PaymentSuccessModalComponent, {windowClass: 'success'});
    });

    it('should call actionPayment if response status is requires_action', () => {
      spyOn(subscriptionsService, 'newSubscription').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_ACTION));
      spyOn(stripeService, 'actionPayment').and.callThrough();

      component.isRetryInvoice = false;

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      
      expect(stripeService.actionPayment).toHaveBeenCalledWith(SUBSCRIPTION_REQUIRES_ACTION.payment_secret_key);
    });

    it('should call requestNewPayment if response status is requires_payment_method', () => {
      component.isRetryInvoice = false;
      spyOn(errorsService, 'i18nError');
      spyOn(subscriptionsService, 'newSubscription').and.returnValue(Observable.of({response: { status: 202}}));
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(Observable.of(SUBSCRIPTION_REQUIRES_PAYMENT));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);

      expect(component.loading).toBe(true);
      expect(component.isPaymentError).toBe(true);
      expect(component.action).toBe('clear');
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailed');

    });
  });

  describe('setCardInfo', () => {
    it('should set the card info', ()=> {
      component.setCardInfo(STRIPE_CARD);

      expect(component.card).toEqual(STRIPE_CARD);
    });
  });

  describe('hasStripeCard', () => {
    it('should not call addNewCard if hasCard is true', () => {
      component.hasStripeCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if hasCard is false', () => {
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
      component.setSavedCard(FINANCIAL_CARD_OPTION[0]);

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
      expect(component.selectedCard).toBe(true);
      expect(component.setCardInfo).toHaveBeenCalledWith(FINANCIAL_CARD_OPTION[0]);
    });
  });

  describe('selectListingLimit', () => {
    let event = { preventDefault: jasmine.createSpy(), srcElement: jasmine.createSpy() };
    (<any>event).srcElement.innerText = '40';
    
    it('should set the listing limit', () => {
      component.selectListingLimit(event);

      expect(component.listingLimit).toBe(40);
    });
  });

  describe('onSlide', () => {
    it('should set isLast when is last slide', () => {
      component.onSlide({
        current: 'ngb-slide-1'
      } as NgbSlideEvent);

      expect(component.isLast).toBe(true);
      expect(component.currentSlide).toEqual('ngb-slide-1');
    });
  });

});