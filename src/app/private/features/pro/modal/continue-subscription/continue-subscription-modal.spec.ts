import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickCancelCloseSubscription,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ContinueSubscriptionModalComponent } from './continue-subscription-modal.component';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';

describe('ContinueSubscriptionModalComponent', () => {
  let component: ContinueSubscriptionModalComponent;
  let fixture: ComponentFixture<ContinueSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let analyticsService: AnalyticsService;
  let subscriptionsService: SubscriptionsService;
  let toastService: ToastService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContinueSubscriptionModalComponent],
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
              continueSubscription() {
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
    fixture = TestBed.createComponent(ContinueSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    fixture.detectChanges();
  });

  describe('close', () => {
    it('should close the modal and redirect to the profile', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalledWith(ModalStatuses.CONTINUE);
    });
  });

  describe('continueSubscription', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'continueSubscription').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });

    const tier = MAPPED_SUBSCRIPTIONS[2].selected_tier;

    it('should call the cancelsubscription service', () => {
      component.continueSubscription();

      expect(component.subscriptionsService.continueSubscription).toHaveBeenCalledWith(tier.id);
      expect(component.loading).toBe(false);
    });

    it('should send event to analytics', () => {
      const expectedEvent: AnalyticsEvent<ClickCancelCloseSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickCancelCloseSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          tier: component.subscription.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription,
        },
      };

      component.continueSubscription();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
