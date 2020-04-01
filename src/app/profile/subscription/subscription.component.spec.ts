import { SubscriptionsComponent } from "./subscription.component";
import { ComponentFixture, TestBed, async, fakeAsync, tick, flush } from "@angular/core/testing";
import { CategoryService } from "../../core/category/category.service";
import { SubscriptionsService } from "../../core/subscriptions/subscriptions.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable, of } from "rxjs";
import { CATEGORY_DATA_WEB } from "../../../tests/category.fixtures.spec";
import { MAPPED_SUBSCRIPTIONS, MAPPED_SUBSCRIPTIONS_ADDED, MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED, MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED, MAPPED_SUBSCRIPTIONS_WITH_INAPP } from "../../../tests/subscriptions.fixtures.spec";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from "./modals/add-new-subscription-modal.component";
import { EditSubscriptionModalComponent } from './modals/edit-subscription-modal.component'
import { EventService } from "../../core/event/event.service";
import { Router } from "@angular/router";
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import {
  SCREEN_IDS,
  ANALYTICS_EVENT_NAMES,
  AnalyticsEvent,
  ClickSuscribeOnTheBenefitsScreen,
  ANALYTIC_EVENT_TYPES,
  AnalyticsPageView,
  ViewProfileSubscription,
  ClickProfileSubscribeButton,
  ClickProfileUnsuscribe,
  ClickUnsuscribeCancelation
} from '../../core/analytics/analytics-constants';
import { CancelSubscriptionModalComponent } from "./modals/cancel-subscription-modal.component";
import { ContinueSubscriptionModalComponent } from "./modals/continue-subscription-modal.component";
import { CheckSubscriptionInAppModalComponent } from "./modals/check-subscription-in-app-modal/check-subscription-in-app-modal.component";
import { UnsubscribeInAppFirstModal } from "./modals/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component";

describe('SubscriptionComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;
  let categoryService: CategoryService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;
  let router: Router;
  let analyticsService: AnalyticsService;
  const componentInstance = {subscription: MAPPED_SUBSCRIPTIONS[0]};
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsComponent ],
      providers: [
        EventService,
        {
          provide: SubscriptionsService, useValue: {
            getSubscriptions() {
              return of(MAPPED_SUBSCRIPTIONS);
            },
            isSubscriptionInApp() {
              return false;
            },
            isOneSubscriptionInApp() {
              return false;
            },
            isStripeSubscription() {
              return true;
            }
          }
        },
        {
          provide: CategoryService, useValue: {
            getCategories() {
                return of(CATEGORY_DATA_WEB);
              }
            }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
    schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    modalService = TestBed.get(NgbModal);
    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    subscriptionsService = TestBed.get(SubscriptionsService);
    categoryService = TestBed.get(CategoryService);
    router = TestBed.get(Router);
    analyticsService = TestBed.get(AnalyticsService);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should get the mapped subscriptions', () => {
      spyOn(categoryService, 'getCategories').and.callThrough();
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS));
      
      component.ngOnInit();
      
      expect(component.subscriptions).toEqual(MAPPED_SUBSCRIPTIONS);
    });

    it('should send page view event to analytics', () => {
      spyOn(analyticsService, 'trackPageView');
      const expectedPageViewEvent: AnalyticsPageView<ViewProfileSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ViewProfileSubscription,
        attributes: {
          screenId: SCREEN_IDS.ProfileSubscription
        }
      };

      component.ngOnInit();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('openSubscriptionModal', () => {
    it('should open the addNewSubscription modal when subscription is not active', () => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);

      expect(modalService.open).toHaveBeenCalledWith(AddNewSubscriptionModalComponent, {
        windowClass: 'review'
      });
    });

    it('should not open the EditSubscription modal when subscription is not active', () => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[1]);

      expect(modalService.open).not.toHaveBeenCalledWith(EditSubscriptionModalComponent, {
        windowClass: 'review'
      });
    });

    it('should not set loading to true if action is not present', () => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(null),
        componentInstance: componentInstance
      });

      component.subscriptions = MAPPED_SUBSCRIPTIONS;

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);

      expect(component.loading).toBe(false);
    });

    it('should redirect to profile if action is present and subscription changed', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('add'),
        componentInstance: componentInstance
      });
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_ADDED));
      spyOn(router, 'navigate');

      component.subscriptions = MAPPED_SUBSCRIPTIONS;

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);
      tick(1000);

      expect(router.navigate).toHaveBeenCalledWith(['profile/info']);
    }));

    describe('when the user is subscribed to the selected category', () => {
      it('should send click profile unsubscribe event', () => {
        spyOn(analyticsService, 'trackEvent');
        const expectedEvent: AnalyticsEvent<ClickProfileUnsuscribe> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileUnsuscribe,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: MAPPED_SUBSCRIPTIONS_ADDED[0].category_id as any
          }
        };

        component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS_ADDED[0]);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });

      describe('and the subscription is from Android or iOS', () => {
        it('should open a modal that says to modify subscription in app', () => {
          spyOn(subscriptionsService, 'isSubscriptionInApp').and.returnValue(true);
          spyOn(modalService, 'open').and.callThrough();

          component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS_WITH_INAPP[0]);

          expect(modalService.open).toHaveBeenCalledWith(CheckSubscriptionInAppModalComponent, { windowClass: 'review' });
        });
      });

      describe('and the subscription has only one tier', () => {
        it('should open the cancel modal', () => {
          spyOn(modalService, 'open').and.callThrough();

          component.openSubscriptionModal(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED);
          
          expect(modalService.open).toHaveBeenCalledWith(CancelSubscriptionModalComponent, { windowClass: 'review' });
        });
      });
    });

    describe('when the user has cancelled the subscription', () => {
      it('should open the continue subscribed modal', () => {
        spyOn(modalService, 'open').and.callThrough();

        component.openSubscriptionModal(MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED);
        
        expect(modalService.open).toHaveBeenCalledWith(ContinueSubscriptionModalComponent, { windowClass: 'review' });
      })
    });

    describe('when the user is NOT subscribed to the selected category and has another subscription', () => {
      it('should send click profile subscribe event with isNewSubscriber false', () => {
        spyOn(analyticsService, 'trackEvent');
        const expectedEvent: AnalyticsEvent<ClickProfileSubscribeButton> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: MAPPED_SUBSCRIPTIONS[0].category_id as any,
            isNewSubscriber: false
          }
        };

        component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });

      it('should open a unsubscribe inapp first modal if one subscription is inapp and selected sub is not active', () => {
        spyOn(subscriptionsService, 'isOneSubscriptionInApp').and.returnValue(true);
        spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);
        spyOn(modalService, 'open').and.callThrough();

        component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS_WITH_INAPP[1]);

        expect(modalService.open).toHaveBeenCalledWith(UnsubscribeInAppFirstModal, { windowClass: 'review' });
      });
    });

    describe('when the user is NOT subscribed to the selected category and no other category', () => {
      it('should send click profile subscribe event with isNewSubscriber true', () => {
        spyOn(analyticsService, 'trackEvent');
        const expectedEvent: AnalyticsEvent<ClickProfileSubscribeButton> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: MAPPED_SUBSCRIPTIONS[0].category_id as any,
            isNewSubscriber: true
          }
        };
        component.subscriptions.forEach(s => { s.subscribed_from = null; s.subscribed_until = null; });

        component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('when the modal dismisses', () => {
      it('should send close event with the open one', fakeAsync(() => {
        spyOn(analyticsService, 'trackEvent');
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.reject({}),
          componentInstance
        });
        const expectedOpenModalEvent: AnalyticsEvent<ClickProfileSubscribeButton> = {
          name: ANALYTICS_EVENT_NAMES.ClickProfileSubscribeButton,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription,
            subscription: MAPPED_SUBSCRIPTIONS[0].category_id as any,
            isNewSubscriber: true
          }
        };
        const expectedCloseModalEvent: AnalyticsEvent<ClickUnsuscribeCancelation> = {
          name: ANALYTICS_EVENT_NAMES.ClickUnsuscribeCancelation,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            screenId: SCREEN_IDS.ProfileSubscription
          }
        };

        component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);
        tick();

        expect(analyticsService.trackEvent).toHaveBeenCalledTimes(2);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedOpenModalEvent);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedCloseModalEvent);
      }));
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
