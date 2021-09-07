import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmCloseSubscription,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

describe('CancelSubscriptionModalComponent', () => {
  let component: CancelSubscriptionModalComponent;
  let fixture: ComponentFixture<CancelSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let toastService: ToastService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CancelSubscriptionModalComponent],
        providers: [
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: {},
                };
              },
            },
          },
          {
            provide: SubscriptionsService,
            useValue: {
              cancelSubscription() {
                return of(202);
              },
            },
          },
          I18nService,
          {
            provide: AnalyticsService,
            useClass: MockAnalyticsService,
          },
          ToastService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    component.subscription = MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED;
    fixture.detectChanges();
  });

  describe('cancelSubscription', () => {
    it('should call the cancelsubscription service', () => {
      const tier = component.subscription.selected_tier;
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(of({ status: 202 }));

      component.cancelSubscription();

      expect(component.subscriptionsService.cancelSubscription).toHaveBeenCalledWith(tier.id);
      expect(component.loading).toBe(false);
    });

    it('should send the event', () => {
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(of({ status: 202 }));
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickConfirmCloseSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickConfirmCloseSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          tier: component.subscription.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription,
        },
      };

      component.cancelSubscription();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
