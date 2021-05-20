import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { StripeService } from '@core/stripe/stripe.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import { CARDS_WITHOUT_DEFAULT, CARDS_WITH_ONE_DEFAULT, MockStripeService } from '@fixtures/stripe.fixtures.spec';
import { MockSubscriptionService, MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { NewSubscriptionComponent } from './new-subscription.component';

@Component({
  selector: 'tsl-subscription-card-selector',
  template: '',
})
class MockSubscriptionCardSelector {}

describe('NewSubscriptionComponent', () => {
  let component: NewSubscriptionComponent;
  let fixture: ComponentFixture<NewSubscriptionComponent>;
  let stripeService: StripeService;
  let errorsService: ErrorsService;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let scrollIntoViewService: ScrollIntoViewService;
  let eventService: EventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubscriptionComponent, MockSubscriptionCardSelector],
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
    fixture = TestBed.createComponent(NewSubscriptionComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.user = MOCK_USER;
    stripeService = TestBed.inject(StripeService);
    errorsService = TestBed.inject(ErrorsService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    scrollIntoViewService = TestBed.inject(ScrollIntoViewService);
    eventService = TestBed.inject(EventService);
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
        it('should show card selector', () => {
          const cardSelector = fixture.debugElement.query(By.directive(MockSubscriptionCardSelector));

          expect(cardSelector).toBeTruthy();
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
        it('should show card selector', () => {
          const cardSelector = fixture.debugElement.query(By.directive(MockSubscriptionCardSelector));

          expect(cardSelector).toBeTruthy();
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
        it('should show card selector', () => {
          const cardSelector = fixture.debugElement.query(By.directive(MockSubscriptionCardSelector));

          expect(cardSelector).toBeFalsy();
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
        it('should show card selector', () => {
          const cardSelector = fixture.debugElement.query(By.directive(MockSubscriptionCardSelector));

          expect(cardSelector).toBeFalsy();
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
          spyOn(subscriptionsService, 'getBenefits').and.returnValue(benefits);
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
    describe('and is invoice requeried', () => {
      it('should save invoice data before', () => {
        spyOn(eventService, 'emit');
        component.isInvoiceRequired = true;

        component.onPurchaseButtonClick();

        expect(eventService.emit).toBeCalledTimes(1);
        expect(eventService.emit).toHaveBeenCalledWith(EventService.BILLING_INFO_FORM_SUBMITED);
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
  });
});
