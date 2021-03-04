import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionDirectContact,
  ClickSubscriptionSubscribe,
  SCREEN_IDS,
  SubscriptionPayConfirmation,
  ViewSubscriptionTier,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ModalStatuses } from '@private/features/profile/core/modal.statuses.enum';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { PAYMENT_METHOD_DATA } from '@fixtures/payments.fixtures.spec';
import { FINANCIAL_CARD_OPTION, STRIPE_CARD } from '@fixtures/stripe.fixtures.spec';
import {
  MAPPED_SUBSCRIPTIONS,
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  SUBSCRIPTION_REQUIRES_ACTION,
  SUBSCRIPTION_REQUIRES_PAYMENT,
  SUBSCRIPTION_SUCCESS,
  TIER,
} from '@fixtures/subscriptions.fixtures.spec';
import { NgbActiveModal, NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe, DateUntilDayPipe } from '@shared/pipes';
import { I18nService } from 'app/core/i18n/i18n.service';
import { PaymentService } from 'app/core/payments/payment.service';
import { of, throwError } from 'rxjs';
import { PaymentSuccessModalComponent } from '../payment-success/payment-success-modal.component';
import { AddNewSubscriptionModalComponent } from './add-new-subscription-modal.component';

describe('AddNewSubscriptionModalComponent', () => {
  let component: AddNewSubscriptionModalComponent;
  let fixture: ComponentFixture<AddNewSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  let errorsService: ErrorsService;
  let stripeService: StripeService;
  let subscriptionsService: SubscriptionsService;
  let eventService: EventService;
  let analyticsService: AnalyticsService;
  let paymentService: PaymentService;
  let i18nService: I18nService;
  const componentInstance = {
    subscription: MAPPED_SUBSCRIPTIONS[2],
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbCarouselModule],
        declarations: [AddNewSubscriptionModalComponent, CustomCurrencyPipe, DateUntilDayPipe],
        providers: [
          DecimalPipe,
          EventService,
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
            },
          },
          {
            provide: StripeService,
            useValue: {
              addNewCard() {
                return of(200);
              },
              actionPayment() {},
            },
          },
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: PaymentService,
            useValue: {
              getBillingInfo() {
                return of('');
              },
            },
          },
          {
            provide: AnalyticsService,
            useClass: MockAnalyticsService,
          },
          I18nService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    modalService = TestBed.inject(NgbModal);
    stripeService = TestBed.inject(StripeService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    errorsService = TestBed.inject(ErrorsService);
    eventService = TestBed.inject(EventService);
    analyticsService = TestBed.inject(AnalyticsService);
    paymentService = TestBed.inject(PaymentService);
    i18nService = TestBed.inject(I18nService);
    component.card = STRIPE_CARD;
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    component.isNewSubscriber = false;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should select invoice default option', () => {
      component.ngOnInit();

      expect(component.selectedInvoiceOption).toBe('false');
    });

    it('should get the billing info from a user', () => {
      spyOn(component, 'getBillingInfo').and.callThrough();

      component.ngOnInit();

      expect(component.getBillingInfo).toHaveBeenCalled();
    });

    it('should set the default tier', () => {
      component.ngOnInit();
      component.subscription = MAPPED_SUBSCRIPTIONS[0];

      expect(component.selectedTier).toEqual(MAPPED_SUBSCRIPTIONS[2].tiers[1]);
    });

    describe('and when the webapp is in English', () => {
      it('should set the English invoice options', () => {
        const expectedEnglishInvoiceOptions = [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ];

        component.ngOnInit();

        expect(component.invoiceOptions).toEqual(expectedEnglishInvoiceOptions);
      });
    });

    describe('and when the webapp is in Spanish', () => {
      beforeEach(() => (i18nService['_locale'] = 'es'));

      it('should set the Spanish invoice options', () => {
        const expectedSpanishInvoiceOptions = [
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' },
        ];

        component.ngOnInit();

        expect(component.invoiceOptions).toEqual(expectedSpanishInvoiceOptions);
      });
    });
  });

  describe('close', () => {
    it('shoud close the active modal', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalledWith(ModalStatuses.ADD);
    });
  });

  describe('addSubscription', () => {
    it('should set loading to true', () => {
      component.addSubscription(PAYMENT_METHOD_DATA);

      expect(component.loading).toBe(true);
    });

    it('should requestNewPayment if card is not attached', fakeAsync(() => {
      spyOn(stripeService, 'addNewCard').and.returnValue(
        throwError(
          new HttpErrorResponse({
            error: [{ error_code: STRIPE_ERROR.card_declined, message: '' }],
          })
        )
      );
      spyOn(errorsService, 'i18nError');

      component.addSubscription(PAYMENT_METHOD_DATA);
      tick();

      expect(component.loading).toBe(false);
      expect(component.paymentError).toBe(STRIPE_ERROR.card_declined);
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailed', '', 'paymentFailedToastTitle');
    }));

    it('should call addSubscriptionFromSavedCard if card is attached and it is no retry', fakeAsync(() => {
      component.isRetryInvoice = false;
      component.card = STRIPE_CARD;
      spyOn(stripeService, 'addNewCard').and.returnValue(of(200));
      spyOn(component, 'addSubscriptionFromSavedCard').and.callThrough();

      component.addSubscription(PAYMENT_METHOD_DATA);

      expect(component.addSubscriptionFromSavedCard).toHaveBeenCalled();
    }));
  });

  describe('addSubscriptionFromSavedCard', () => {
    beforeEach(fakeAsync(() => {
      spyOn(subscriptionsService, 'newSubscription').and.returnValue(of({ status: 202 }));

      component.isRetryInvoice = false;
    }));

    it('should update loading to false', fakeAsync(() => {
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

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
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(subscriptionsService.checkNewSubscriptionStatus).toHaveBeenCalled();
    }));

    it('should close the actual modal if response status is succeeded', fakeAsync(() => {
      spyOn(component, 'close');
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.isRetryInvoice).toBe(false);
      expect(component.close).toHaveBeenCalled();
    }));

    it('should show success modal if response status is succeeded', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.isRetryInvoice).toBe(false);
      expect(modalService.open).toHaveBeenCalledWith(PaymentSuccessModalComponent, {
        windowClass: 'success',
      });
    }));

    it('should call actionPayment if response status is requires_action', fakeAsync(() => {
      spyOn(stripeService, 'actionPayment').and.callThrough();
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_REQUIRES_ACTION));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(stripeService.actionPayment).toHaveBeenCalledWith(SUBSCRIPTION_REQUIRES_ACTION.payment_secret_key);
    }));

    it('should call requestNewPayment if response status is requires_payment_method', fakeAsync(() => {
      spyOn(errorsService, 'i18nError');
      spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_REQUIRES_PAYMENT));

      component.addSubscriptionFromSavedCard(PAYMENT_METHOD_DATA.id);
      tick();

      expect(component.loading).toBe(false);
      expect(errorsService.i18nError).toHaveBeenCalledWith('paymentFailedUnknown', '', 'paymentFailedToastTitle');
    }));
  });

  describe('setCardInfo', () => {
    it('should set the card info', () => {
      component.setCardInfo(STRIPE_CARD);

      expect(component.card).toEqual(STRIPE_CARD);
    });
  });

  describe('hasCard', () => {
    it('should not call addNewCard if hasCard is true', () => {
      spyOn(component, 'addNewCard').and.callThrough();
      component.hasCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if hasCard is false', () => {
      spyOn(component, 'addNewCard').and.callThrough();
      component.hasCard(false);

      expect(component.addNewCard).toHaveBeenCalled();
    });
  });

  describe('addNewCard', () => {
    it('should show the new card element', () => {
      component.addNewCard();

      expect(component.showCard).toBe(true);
      expect(component.savedCard).toBe(false);
    });
  });

  describe('removeNewCard', () => {
    it('should show the saved card element', () => {
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

  describe('trackClickContinueToPayment', () => {
    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickSubscriptionSubscribe> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionSubscribe,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          screenId: SCREEN_IDS.Subscription,
          tier: component.selectedTier.id,
          price: component.selectedTier.price,
          freeTrial: component.subscription.trial_available,
        },
      };

      component.trackClickContinueToPayment();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('trackClickPay', () => {
    beforeEach(() => spyOn(analyticsService, 'trackEvent'));

    describe('when user created a new card', () => {
      describe('and when user selected invoice', () => {
        beforeEach(() => component.onInvoiceOptionSelect({ value: 'true' }));

        it('should send valid event', () => {
          const expectedEvent: AnalyticsEvent<SubscriptionPayConfirmation> = {
            name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
            eventType: ANALYTIC_EVENT_TYPES.Transaction,
            attributes: {
              subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
              tier: component.selectedTier.id,
              screenId: SCREEN_IDS.ProfileSubscription,
              isNewCard: true,
              isNewSubscriber: component.isNewSubscriber,
              discountPercent: 0,
              invoiceNeeded: true,
              freeTrial: false,
            },
          };

          component.trackClickPay(true);

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and when user did not select invoice', () => {
        beforeEach(() => component.onInvoiceOptionSelect({ value: 'false' }));

        it('should send valid event', () => {
          const expectedEvent: AnalyticsEvent<SubscriptionPayConfirmation> = {
            name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
            eventType: ANALYTIC_EVENT_TYPES.Transaction,
            attributes: {
              subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
              tier: component.selectedTier.id,
              screenId: SCREEN_IDS.ProfileSubscription,
              isNewCard: true,
              isNewSubscriber: component.isNewSubscriber,
              discountPercent: 0,
              invoiceNeeded: false,
              freeTrial: false,
            },
          };

          component.trackClickPay(true);

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });

    describe('when user did not create new card', () => {
      describe('and when the user selected invoice', () => {
        beforeEach(() => component.onInvoiceOptionSelect({ value: 'true' }));

        it('should send valid event', () => {
          const expectedEvent: AnalyticsEvent<SubscriptionPayConfirmation> = {
            name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
            eventType: ANALYTIC_EVENT_TYPES.Transaction,
            attributes: {
              subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
              tier: component.selectedTier.id,
              screenId: SCREEN_IDS.ProfileSubscription,
              isNewCard: true,
              isNewSubscriber: component.isNewSubscriber,
              discountPercent: 0,
              invoiceNeeded: true,
              freeTrial: false,
            },
          };
          expectedEvent.attributes.isNewCard = false;

          component.trackClickPay(false);

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and when the user did not select invoice', () => {
        beforeEach(() => component.onInvoiceOptionSelect({ value: 'false' }));

        it('should send valid event', () => {
          const expectedEvent: AnalyticsEvent<SubscriptionPayConfirmation> = {
            name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
            eventType: ANALYTIC_EVENT_TYPES.Transaction,
            attributes: {
              subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
              tier: component.selectedTier.id,
              screenId: SCREEN_IDS.ProfileSubscription,
              isNewCard: true,
              isNewSubscriber: component.isNewSubscriber,
              discountPercent: 0,
              invoiceNeeded: false,
              freeTrial: false,
            },
          };
          expectedEvent.attributes.isNewCard = false;

          component.trackClickPay(false);

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });
  });

  describe('when the selected subscription type has only one tier', () => {
    it('should set a CSS class that is used for subscriptions with only one tier', () => {
      component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED;
      fixture.detectChanges();

      const carousel: HTMLElement = fixture.elementRef.nativeElement.querySelector('ngb-carousel');

      expect(carousel.className.includes('single')).toBe(true);
    });

    it('should hide first step, current step indicator and change button', () => {
      component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED;
      fixture.detectChanges();

      const firstStepElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('.step-1');
      const carouselIndicatorsElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('.carousel-indicators');
      const carouselIndicatorsElementStyle = getComputedStyle(carouselIndicatorsElement);
      const changeButton: HTMLElement = fixture.elementRef.nativeElement.querySelector('.AddNewSubscription__listing-limit-payment-edit');

      expect(firstStepElement).toBeNull();
      expect(carouselIndicatorsElementStyle.display).toBe('none');
      expect(changeButton).toBeNull();
    });
  });

  describe('trackClickCardealerTypeform', () => {
    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      spyOn(component, 'trackClickCardealerTypeform').and.callThrough();
      const isNewSubscriber = true;
      component.subscription = MAPPED_SUBSCRIPTIONS[1];
      component.isNewSubscriber = isNewSubscriber;
      const expectedEvent: AnalyticsEvent<ClickSubscriptionDirectContact> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionDirectContact,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: CATEGORY_IDS.CAR as 100,
          screenId: SCREEN_IDS.Subscription,
          isNewSubscriber,
        },
      };

      component.trackClickCardealerTypeform();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('User selects invoice option', () => {
    it('should set the selected invoice option', () => {
      const removeFavoriteButton = fixture.debugElement.nativeElement.querySelector('tsl-dropdown');

      removeFavoriteButton.click();

      expect(component.selectedInvoiceOption).toBeTruthy();
    });
  });

  describe('User saves the invoice form', () => {
    it('should set the carousel in step 3', () => {
      const stepThreeElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('.step-3');

      expect(stepThreeElement).toBeTruthy();
    });
  });

  describe('Getting the billing info', () => {
    it('should call the billing info service', () => {
      spyOn(paymentService, 'getBillingInfo').and.callThrough();

      component.getBillingInfo();

      expect(paymentService.getBillingInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('User selects continue to Payment', () => {
    it('should emit the formSubmited event', () => {
      spyOn(eventService, 'emit').and.callThrough();

      const continueToPaymentButton = fixture.debugElement.nativeElement.querySelector('#AddNewSubscription__ButtonActions-payment');
      continueToPaymentButton.click();

      expect(eventService.emit).toHaveBeenCalledWith('formSubmited');
    });
  });

  describe('User selects continue to Invoice', () => {
    it('should go to the invoice slider', () => {
      const invoiceStepElement: HTMLElement = fixture.elementRef.nativeElement.querySelector('.step-2b');

      component.continueToInvoice();

      expect(invoiceStepElement).toBeTruthy();
    });
  });

  describe('trackViewSubscriptionTier', () => {
    describe('has more than a one tier', () => {
      it('should send event to analytics', () => {
        spyOn(analyticsService, 'trackPageView');
        component.subscription = MAPPED_SUBSCRIPTIONS[1];
        const expectedEvent: AnalyticsPageView<ViewSubscriptionTier> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscriptionTier,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionTier,
            freeTrial: false,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('has not more than one tier', () => {
      it('should not send event to analytics', () => {
        spyOn(analyticsService, 'trackPageView');
        component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED;

        component.ngOnInit();

        expect(analyticsService.trackPageView).not.toHaveBeenCalled();
      });
    });
  });
});