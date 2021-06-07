import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS,
  SubscriptionPayConfirmation,
  ViewSubscriptionTier,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import { CARDS_WITHOUT_DEFAULT, CARDS_WITH_ONE_DEFAULT, MockStripeService } from '@fixtures/stripe.fixtures.spec';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import {
  MockSubscriptionService,
  MAPPED_SUBSCRIPTIONS,
  SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_REQUIRES_ACTION,
  SUBSCRIPTION_REQUIRES_PAYMENT,
} from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentSuccessModalComponent } from '@private/features/profile/modal/payment-success/payment-success-modal.component';
import { of, throwError } from 'rxjs';
import { SubscriptionPurchaseComponent, PAYMENT_SUCCESSFUL_CODE } from './subscription-purchase.component';

describe('SubscriptionPurchaseComponent', () => {
  let component: SubscriptionPurchaseComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseComponent>;
  let stripeService: StripeService;
  let errorsService: ErrorsService;
  let subscriptionsService: SubscriptionsService;
  let benefitsService: SubscriptionBenefitsService;
  let analyticsService: AnalyticsService;
  let scrollIntoViewService: ScrollIntoViewService;
  let eventService: EventService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: StripeService,
          useClass: MockStripeService,
        },
        {
          provide: ErrorsService,
          useClass: MockErrorService,
        },
        {
          provide: SubscriptionsService,
          useClass: MockSubscriptionService,
        },
        {
          provide: SubscriptionBenefitsService,
          useClass: MockSubscriptionBenefitsService,
        },
        {
          provide: ScrollIntoViewService,
          useValue: {
            scrollToSelector() {},
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {},
              };
            },
          },
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.user = MOCK_USER;
    stripeService = TestBed.inject(StripeService);
    errorsService = TestBed.inject(ErrorsService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    scrollIntoViewService = TestBed.inject(ScrollIntoViewService);
    eventService = TestBed.inject(EventService);
    modalService = TestBed.inject(NgbModal);
    benefitsService = TestBed.inject(SubscriptionBenefitsService);
  });

  describe('NgOnInit', () => {
    describe('Selected card', () => {
      describe('has default card', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of(CARDS_WITH_ONE_DEFAULT));
          fixture.detectChanges();
        });
        it('should set default card', () => {
          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toEqual(CARDS_WITH_ONE_DEFAULT[1]);
        });
      });
      describe('has not default card', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of(CARDS_WITHOUT_DEFAULT));
          fixture.detectChanges();
        });
        it('should set first card', () => {
          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.selectedCard).toEqual(CARDS_WITHOUT_DEFAULT[0]);
        });
      });
      describe('has not cards', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(of([]));
          fixture.detectChanges();
        });
        it('should not set selected card', () => {
          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.stripeCards).toEqual([]);
          expect(component.selectedCard).toBeUndefined();
        });
      });
      describe('has error', () => {
        beforeEach(() => {
          spyOn(stripeService, 'getCards').and.returnValue(throwError('error'));
          spyOn(errorsService, 'i18nError').and.callThrough();
          fixture.detectChanges();
        });
        it('should not set selected card', () => {
          expect(stripeService.getCards).toBeCalledTimes(1);
          expect(stripeService.getCards).toHaveBeenCalledWith(false);
          expect(component.stripeCards).toBeUndefined();
          expect(component.selectedCard).toBeUndefined();
        });
        it('should show error', () => {
          expect(errorsService.i18nError).toHaveBeenCalledTimes(1);
          expect(errorsService.i18nError).toHaveBeenLastCalledWith(TRANSLATION_KEY.STRIPE_CARDS_RETRIEVAL_ERROR);
        });
      });
    });
    describe('Default tier', () => {
      describe('has default tier', () => {
        it('should set default tier', () => {
          fixture.detectChanges();

          expect(component.selectedTier).toEqual(
            component.subscription.tiers.find((tier) => tier.id === component.subscription.default_tier_id)
          );
        });
      });
    });
    describe('Benefits', () => {
      describe('has benefits', () => {
        it('should set benefits', () => {
          const benefits = ['benefit1', 'benefit2'];
          spyOn(benefitsService, 'getBenefitsByCategory').and.returnValue(benefits);
          fixture.detectChanges();

          expect(component.benefits).toEqual(benefits);
        });
      });
    });
    describe('Track trackViewSubscriptionTier', () => {
      it('should track event', () => {
        const hasTrial = true;
        const event: AnalyticsPageView<ViewSubscriptionTier> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscriptionTier,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionTier,
            freeTrial: hasTrial,
            subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          },
        };
        spyOn(analyticsService, 'trackPageView').and.callThrough();
        spyOn(subscriptionsService, 'hasTrial').and.returnValue(hasTrial);

        fixture.detectChanges();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(event);
      });
    });
    describe('Invoice disabled', () => {
      it('should has to be disabled by default', () => {
        expect(component.isInvoiceRequired).toEqual(false);
      });
    });
  });
  describe('Click change subscription', () => {
    it('should emit change subscription', () => {
      spyOn(component.unselectSubcription, 'emit');

      component.onChageSubscription();

      expect(component.unselectSubcription.emit).toHaveBeenCalledTimes(1);
      expect(component.unselectSubcription.emit).toHaveBeenCalledWith();
    });
  });
  describe('Click scroll to invoice', () => {
    it('should emit change subscription', fakeAsync(() => {
      spyOn(scrollIntoViewService, 'scrollToSelector').and.callThrough();

      component.onScrollToInvoice();
      tick();

      expect(scrollIntoViewService.scrollToSelector).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewService.scrollToSelector).toHaveBeenCalledWith('#billing');
    }));
  });
  describe('Select tier', () => {
    it('should change to selected tier', () => {
      component.selectedTier = component.subscription.tiers[0];

      component.onSelectedTierChanged(component.subscription.tiers[1]);

      expect(component.selectedTier).toEqual(component.subscription.tiers[1]);
    });
  });
  describe('Change card', () => {
    it('should change to selected tier', () => {
      component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];

      component.onChangeSelectedCard(CARDS_WITH_ONE_DEFAULT[1]);

      expect(component.selectedCard).toEqual(CARDS_WITH_ONE_DEFAULT[1]);
    });
  });
  describe('Click buy subscription', () => {
    beforeEach(() => {
      component.selectedTier = component.subscription.tiers[0];
    });
    describe('and is invoice requeried', () => {
      it('should save invoice data before', () => {
        spyOn(eventService, 'emit');
        component.isInvoiceRequired = true;

        component.onPurchaseButtonClick();

        expect(eventService.emit).toBeCalledTimes(1);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.BILLING_INFO_FORM_SUBMITTED);
      });
    });
    describe('is not invoice required', () => {
      beforeEach(() => {
        component.isInvoiceRequired = false;
        component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];
        component.selectedTier = component.subscription.tiers[0];
        component.stripeCards = CARDS_WITH_ONE_DEFAULT;
      });
      it('should set loading', () => {
        component.onPurchaseButtonClick();

        expect(component.isLoading).toEqual(true);
      });
      it('should track SubscriptionPayConfirmation', () => {
        spyOn(subscriptionsService, 'getTierDiscountPercentatge').and.returnValue(0);
        spyOn(subscriptionsService, 'hasTrial').and.returnValue(false);
        spyOn(analyticsService, 'trackEvent').and.callThrough();
        const event: AnalyticsEvent<SubscriptionPayConfirmation> = {
          name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
          eventType: ANALYTIC_EVENT_TYPES.Transaction,
          attributes: {
            subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
            tier: component.selectedTier.id,
            screenId: SCREEN_IDS.ProfileSubscription,
            isNewCard: !component.isSavedCard,
            isNewSubscriber: !component.user.featured,
            discountPercent: 0,
            invoiceNeeded: false,
            freeTrial: false,
          },
        };

        component.onPurchaseButtonClick();

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
    describe('and is not saved card', () => {
      beforeEach(() => {
        component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];
        component.stripeCards = [];
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

        component.purchaseSubscription();
        tick();

        expect(component.isLoading).toBe(false);
        expect(component.paymentError).toBe(STRIPE_ERROR.card_declined);
        expect(errorsService.i18nError).toHaveBeenCalledWith(
          TRANSLATION_KEY.PAYMENT_FAILED_ERROR,
          translations[TRANSLATION_KEY.CARD_NUMBER_INVALID],
          TRANSLATION_KEY.PAYMENT_FAILED_ERROR_TITLE
        );
      }));

      it('should call addSubscriptionFromSavedCard if card is attached and it is no retry', fakeAsync(() => {
        component.isRetryPayment = false;
        component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];
        spyOn(stripeService, 'addNewCard').and.returnValue(of(null));
        spyOn(subscriptionsService, 'newSubscription').and.callThrough();

        component.purchaseSubscription();

        expect(subscriptionsService.newSubscription).toHaveBeenCalledTimes(1);
        expect(subscriptionsService.newSubscription).toHaveBeenCalledWith(
          component.selectedTier.id,
          component.selectedCard.id,
          component.isInvoiceRequired
        );
      }));

      it('should call new subscription if card was atached successfuly', fakeAsync(() => {
        spyOn(stripeService, 'addNewCard').and.returnValue(of(null));
        spyOn(subscriptionsService, 'newSubscription').and.returnValue(of({ status: PAYMENT_SUCCESSFUL_CODE }));
        component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];

        component.purchaseSubscription();
        tick();

        expect(component.isLoading).toBe(false);
        expect(subscriptionsService.newSubscription).toHaveBeenCalled();
      }));
    });
    describe('addSubscriptionFromSavedCard', () => {
      beforeEach(fakeAsync(() => {
        spyOn(subscriptionsService, 'newSubscription').and.returnValue(of({ status: PAYMENT_SUCCESSFUL_CODE }));
        component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];
        component.stripeCards = CARDS_WITH_ONE_DEFAULT;
        component.isRetryPayment = false;
      }));

      it('should update loading to false', fakeAsync(() => {
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

        component.purchaseSubscription();
        tick();

        expect(component.isLoading).toBe(false);
      }));

      it('should call newSubscription if is not retryInvoice', fakeAsync(() => {
        component.purchaseSubscription();
        tick();

        expect(subscriptionsService.newSubscription).toHaveBeenCalled();
      }));

      it('should call checkNewSubscriptionStatus if response is 202', fakeAsync(() => {
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

        component.purchaseSubscription();
        tick();

        expect(subscriptionsService.checkNewSubscriptionStatus).toHaveBeenCalled();
      }));

      it('should emit event when success', fakeAsync(() => {
        spyOn(component.purchaseSuccessful, 'emit');
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

        component.purchaseSubscription();
        tick();

        expect(component.isRetryPayment).toBe(false);
        expect(component.purchaseSuccessful.emit).toHaveBeenCalledTimes(1);
        expect(component.purchaseSuccessful.emit).toHaveBeenCalledWith();
      }));

      it('should show success modal if response status is succeeded', fakeAsync(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_SUCCESS));

        component.purchaseSubscription();
        tick();

        expect(component.isRetryPayment).toBe(false);
        expect(modalService.open).toHaveBeenCalledWith(PaymentSuccessModalComponent, {
          windowClass: 'success',
        });
      }));

      it('should call actionPayment if response status is requires_action', fakeAsync(() => {
        spyOn(stripeService, 'actionPayment').and.callThrough();
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_REQUIRES_ACTION));

        component.purchaseSubscription();
        tick();

        expect(stripeService.actionPayment).toHaveBeenCalledWith(SUBSCRIPTION_REQUIRES_ACTION.payment_secret_key);
      }));

      it('should call requestNewPayment if response status is requires_payment_method', fakeAsync(() => {
        spyOn(errorsService, 'i18nError');
        spyOn(subscriptionsService, 'checkNewSubscriptionStatus').and.returnValue(of(SUBSCRIPTION_REQUIRES_PAYMENT));

        component.purchaseSubscription();
        tick();

        expect(component.isRetryPayment).toBe(true);
        expect(component.isLoading).toBe(false);
        expect(errorsService.i18nError).toHaveBeenCalledWith(
          TRANSLATION_KEY.PAYMENT_FAILED_UNKNOWN_ERROR,
          '',
          TRANSLATION_KEY.PAYMENT_FAILED_ERROR_TITLE
        );
      }));
    });
  });
});
