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
import { PaymentSuccessModalComponent } from '@private/features/pro/modal/payment-success/payment-success-modal.component';
import { of, throwError } from 'rxjs';
import { PAYMENT_SUCCESSFUL_CODE, SubscriptionEditComponent } from './subscription-edit.component';

describe('SubscriptionEditComponent', () => {
  let component: SubscriptionEditComponent;
  let fixture: ComponentFixture<SubscriptionEditComponent>;
  let stripeService: StripeService;
  let errorsService: ErrorsService;
  let subscriptionsService: SubscriptionsService;
  let benefitsService: SubscriptionBenefitsService;
  let analyticsService: AnalyticsService;
  let eventService: EventService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionEditComponent],
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
    fixture = TestBed.createComponent(SubscriptionEditComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.user = MOCK_USER;
    stripeService = TestBed.inject(StripeService);
    errorsService = TestBed.inject(ErrorsService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    eventService = TestBed.inject(EventService);
    modalService = TestBed.inject(NgbModal);
    benefitsService = TestBed.inject(SubscriptionBenefitsService);
  });

  describe('NgOnInit', () => {
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
  });
  describe('Cancel subscription', () => {
    beforeEach(() => {
      spyOn(modalService, 'open');
    });
    it('should open modal', () => {
      spyOn(component.unselectSubcription, 'emit');

      component.cancelSubscription();

      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith();
    });
  });

  describe('Select tier', () => {
    it('should change to selected tier', () => {
      component.selectedTier = component.subscription.tiers[0];

      component.onSelectedTierChanged(component.subscription.tiers[1]);

      expect(component.selectedTier).toEqual(component.subscription.tiers[1]);
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
        expect(eventService.emit).toHaveBeenCalledWith(EventService.FORM_SUBMITTED);
      });
      it('should set loading', () => {
        component.onPurchaseButtonClick();

        expect(component.isLoading).toEqual(true);
      });
      it('should track SubscriptionPayConfirmation', () => {
        spyOn(subscriptionsService, 'hasTrial').and.returnValue(false);
        spyOn(analyticsService, 'trackEvent').and.callThrough();
        const event: AnalyticsEvent<SubscriptionPayConfirmation> = {
          name: ANALYTICS_EVENT_NAMES.SubscriptionPayConfirmation,
          eventType: ANALYTIC_EVENT_TYPES.Transaction,
          attributes: {
            subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
            tier: component.selectedTier.id,
            screenId: SCREEN_IDS.ProfileSubscription,
            isNewSubscriber: !component.user.featured,
            discountPercent: 0,
            invoiceNeeded: false,
            freeTrial: false,
            discount: !!component.selectedTier.discount,
          },
        };

        component.onPurchaseButtonClick();

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
  });
});
