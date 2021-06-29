import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickSubscriptionPlanDone,
  SCREEN_IDS,
  ViewEditSubscriptionPlan,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { ModalStatuses } from '@private/features/pro/modal/modal.statuses.enum';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MAPPED_SUBSCRIPTIONS, TIER } from '@fixtures/subscriptions.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateUntilDayPipe } from '@shared/pipes';
import { of } from 'rxjs';
import { CancelSubscriptionModalComponent } from '../cancel-subscription/cancel-subscription-modal.component';
import { EditSubscriptionModalComponent } from './edit-subscription-modal.component';

describe('EditSubscriptionModalComponent', () => {
  let component: EditSubscriptionModalComponent;
  let fixture: ComponentFixture<EditSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let toastService: ToastService;
  let analyticsService: AnalyticsService;
  let eventService: EventService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditSubscriptionModalComponent, DateUntilDayPipe],
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
                  result: Promise.resolve(true),
                  componentInstance: {},
                };
              },
            },
          },
          {
            provide: SubscriptionsService,
            useValue: {
              editSubscription() {
                return of(202);
              },
            },
          },
          I18nService,
          EventService,
          ToastService,
          {
            provide: AnalyticsService,
            useClass: MockAnalyticsService,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubscriptionModalComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    activeModal = TestBed.inject(NgbActiveModal);
    modalService = TestBed.inject(NgbModal);
    eventService = TestBed.inject(EventService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should set the selected tier and plan', () => {
      component.ngOnInit();

      expect(component.selectedTier).toEqual(MAPPED_SUBSCRIPTIONS[2].selected_tier);
    });

    it('should send the page view event to analytics', () => {
      spyOn(analyticsService, 'trackPageView');
      const expectedPageView: AnalyticsPageView<ViewEditSubscriptionPlan> = {
        name: ANALYTICS_EVENT_NAMES.ViewEditSubscriptionPlan,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagement,
        },
      };
      component.ngOnInit();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageView);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('close', () => {
    it('should close the modal with modal status', () => {
      spyOn(activeModal, 'close');

      component.close(ModalStatuses.UPDATE);

      expect(activeModal.close).toHaveBeenCalledWith(ModalStatuses.UPDATE);
    });
  });

  describe('selectListingLimit', () => {
    it('should set the selected tier', () => {
      const tier = TIER;

      component.selectListingLimit(tier);

      expect(component.selectedTier).toEqual(tier);
    });
  });

  describe('isCurrentTier selected', () => {
    it('should return if the selected tier is the current subscription', () => {
      const tier = MAPPED_SUBSCRIPTIONS[2].selected_tier;

      component.ngOnInit();
      component.selectListingLimit(tier);
      component.isCurrentTier();

      expect(component.isCurrentTier()).toBe(true);
    });
  });

  describe('editSubscription', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'editSubscription').and.callThrough();
      spyOn(analyticsService, 'trackEvent');
    });

    const tier = MAPPED_SUBSCRIPTIONS[2].selected_tier;

    it('should call the editSubscription service', () => {
      component.editSubscription();

      expect(component.subscriptionsService.editSubscription).toHaveBeenCalledWith(MAPPED_SUBSCRIPTIONS[2], tier.id);
      expect(component.loading).toBe(false);
    });

    it('should send event to analytics', () => {
      const expectedEvent: AnalyticsEvent<ClickSubscriptionPlanDone> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionPlanDone,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          previousTier: component.currentTier.id,
          newTier: component.selectedTier.id,
          screenId: SCREEN_IDS.SubscriptionManagement,
        },
      };

      component.editSubscription();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('cancelSubscriptionModal', () => {
    it('should open the cancelSubscription modal', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.cancelSubscription();

      expect(modalService.open).toHaveBeenCalledWith(CancelSubscriptionModalComponent, {
        windowClass: 'review',
      });
    });
  });
});
