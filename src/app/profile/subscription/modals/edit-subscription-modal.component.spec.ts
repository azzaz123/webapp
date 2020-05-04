import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSubscriptionModalComponent } from './edit-subscription-modal.component';
import { MAPPED_SUBSCRIPTIONS, TIER, SUBSCRIPTIONS_NOT_SUB } from '../../../../tests/subscriptions.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { Observable, of } from 'rxjs';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../tests/analytics.fixtures.spec';
import {
  ViewEditSubscriptionPlan,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsPageView,
  AnalyticsEvent,
  ClickProfileSubscribeButton,
  ANALYTIC_EVENT_TYPES,
  ClickConfirmEditCurrentSubscription
} from '../../../core/analytics/analytics-constants';
import { SUBSCRIPTION_CATEGORIES } from '../../../core/subscriptions/subscriptions.interface';

describe('EditSubscriptionModalComponent', () => {
  let component: EditSubscriptionModalComponent;
  let fixture: ComponentFixture<EditSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let toastrService: ToastrService;
  let analyticsService: AnalyticsService;
  let eventService: EventService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubscriptionModalComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            },
            show() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {}
              };
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            editSubscription() {
              return of(202);
            }
          }
        },
        I18nService,
        EventService,
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubscriptionModalComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.get(ToastrService);
    activeModal = TestBed.get(NgbActiveModal);
    modalService = TestBed.get(NgbModal);
    eventService = TestBed.get(EventService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    analyticsService = TestBed.get(AnalyticsService);
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
          screenId: SCREEN_IDS.SubscriptionManagement
        }
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
    it('should close the modal and redirect to the profile', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalled();
    })
  })

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
    })
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
      const expectedEvent: AnalyticsEvent<ClickConfirmEditCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickConfirmEditCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: component.subscription.category_id as SUBSCRIPTION_CATEGORIES,
          previousTier: component.currentTier.id,
          newTier: component.selectedTier.id,
          screenId: SCREEN_IDS.ProfileSubscription
        }
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
        windowClass: 'review'
      });
    });
  });

});