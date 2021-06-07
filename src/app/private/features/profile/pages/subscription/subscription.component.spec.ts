import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickKeepCurrentSubscription,
  ClickProfileEditCurrentSubscription,
  ClickProSubscription,
  ClickSubscriptionManagementPlus,
  SCREEN_IDS,
  ViewSubscription,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CategoryService } from '@core/category/category.service';
import { EventService } from '@core/event/event.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { CancelSubscriptionModalComponent } from '@private/features/profile/modal/cancel-subscription/cancel-subscription-modal.component';
import { CheckSubscriptionInAppModalComponent } from '@private/features/profile/modal/check-subscription-in-app-modal/check-subscription-in-app-modal.component';
import { ContinueSubscriptionModalComponent } from '@private/features/profile/modal/continue-subscription/continue-subscription-modal.component';
import { EditSubscriptionModalComponent } from '@private/features/profile/modal/edit-subscription/edit-subscription-modal.component';
import { UnsubscribeInAppFirstModal } from '@private/features/profile/modal/unsubscribe-in-app-first-modal/unsubscribe-in-app-first-modal.component';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import {
  MAPPED_SUBSCRIPTIONS,
  MAPPED_SUBSCRIPTIONS_ADDED,
  MAPPED_SUBSCRIPTIONS_WITH_INAPP,
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS_NOT_SUB,
} from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_FULL_USER, MOCK_FULL_USER_FEATURED, MOCK_FULL_USER_NON_FEATURED, USER_DATA } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/core/user/user.service';
import { of } from 'rxjs';
import { SubscriptionsComponent } from './subscription.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'tsl-subscription-purchase',
  template: '',
})
class MockNewSubscriptionComponent {}

describe('SubscriptionComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;
  let categoryService: CategoryService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;
  let router: Router;
  let analyticsService: AnalyticsService;
  let userService: UserService;
  let route: ActivatedRoute;
  const componentInstance = { subscription: MAPPED_SUBSCRIPTIONS[0] };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubscriptionsComponent, MockNewSubscriptionComponent],
        providers: [
          EventService,
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          {
            provide: CategoryService,
            useValue: {
              getCategories() {
                return of(CATEGORY_DATA_WEB);
              },
            },
          },
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
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: () => null,
                },
                queryParamMap: {
                  get: () => null,
                },
              },
            },
          },
          {
            provide: UserService,
            useValue: {
              getAndUpdateLoggedUser: () => of(MOCK_FULL_USER_FEATURED),
              get user() {
                return USER_DATA;
              },
            },
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    subscriptionsService = TestBed.inject(SubscriptionsService);
    categoryService = TestBed.inject(CategoryService);
    router = TestBed.inject(Router);
    analyticsService = TestBed.inject(AnalyticsService);
    userService = TestBed.inject(UserService);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should get the mapped subscriptions', () => {
      spyOn(categoryService, 'getCategories').and.callThrough();
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS));

      component.ngOnInit();

      expect(component.subscriptions).toEqual(MAPPED_SUBSCRIPTIONS);
    });

    it('should set the user information', () => {
      component.ngOnInit();

      expect(component.user).toEqual(USER_DATA);
    });

    describe('Track param events', () => {
      describe('when has param events', () => {
        it('should track event', () => {
          spyOn(analyticsService, 'trackEvent');
          spyOn(route.snapshot.paramMap, 'get').and.returnValue('true');
          const expectedPageViewEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.WebHome,
              isLoggedIn: true,
            },
          };

          component.ngOnInit();

          expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedPageViewEvent);
        });
      });

      describe('when has not param events', () => {
        it('should not track event', () => {
          spyOn(analyticsService, 'trackEvent');

          component.ngOnInit();

          expect(analyticsService.trackEvent).not.toHaveBeenCalled();
        });
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('Send page view event to analytics', () => {
    describe('when is PRO', () => {
      it('should send event', () => {
        spyOn(analyticsService, 'trackPageView');
        const expectedPageViewEvent: AnalyticsPageView<ViewSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscription,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionManagement,
            isPro: true,
            freeTrialSubscriptions: null,
            source: null,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
      });
    });

    describe('when is not PRO', () => {
      it('should send event', () => {
        component.user.featured = false;
        spyOn(analyticsService, 'trackPageView');
        const expectedPageViewEvent: AnalyticsPageView<ViewSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscription,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionManagement,
            isPro: false,
            freeTrialSubscriptions: null,
            source: null,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
      });
    });

    describe('when is redirect from landing', () => {
      it('should send event', () => {
        component.user.featured = true;
        spyOn(analyticsService, 'trackPageView');
        spyOn(route.snapshot.queryParamMap, 'get').and.returnValue('landing_banner');
        const expectedPageViewEvent: AnalyticsPageView<ViewSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscription,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionManagement,
            isPro: true,
            freeTrialSubscriptions: null,
            source: 'landing_banner',
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
      });
    });

    describe('when has trial availables', () => {
      it('should send event', () => {
        component.user.featured = false;
        spyOn(analyticsService, 'trackPageView');
        spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_ADDED));

        const expectedPageViewEvent: AnalyticsPageView<ViewSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscription,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionManagement,
            isPro: false,
            freeTrialSubscriptions: '14000',
            source: null,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
      });
    });

    describe('when has no trial available', () => {
      it('should send event', () => {
        component.user.featured = true;
        spyOn(analyticsService, 'trackPageView');
        const expectedPageViewEvent: AnalyticsPageView<ViewSubscription> = {
          name: ANALYTICS_EVENT_NAMES.ViewSubscription,
          attributes: {
            screenId: SCREEN_IDS.SubscriptionManagement,
            isPro: true,
            freeTrialSubscriptions: null,
            source: null,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageViewEvent);
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('show new subscription flow', () => {
    it('should show new subscription form when subscription is not active', () => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);
      fixture.detectChanges();

      const newSubscriptionComponent = fixture.debugElement.query(By.directive(MockNewSubscriptionComponent));
      expect(newSubscriptionComponent).toBeTruthy();
    });

    it('should not open the EditSubscription modal when subscription is not active', () => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[1]);

      expect(modalService.open).not.toHaveBeenCalledWith(EditSubscriptionModalComponent, {
        windowClass: 'review',
      });
    });

    it('should not set loading to true if action is not present', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(undefined),
        componentInstance: componentInstance,
      });
      component.subscriptions = MAPPED_SUBSCRIPTIONS;

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);

      expect(component.loading).toBe(false);
    }));

    it('should not load if it is updating', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('update'),
        componentInstance: componentInstance,
      });
      component.subscriptions = MAPPED_SUBSCRIPTIONS;

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);
      tick(400000);

      expect(component.loading).toBe(false);
    }));
  });

  it('should redirect to subscriptions if action is present and user is featured', fakeAsync(() => {
    component.user.featured = true;
    spyOn(modalService, 'open').and.returnValue({
      result: Promise.resolve(true),
      componentInstance: componentInstance,
    });
    spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_ADDED));
    spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
    spyOn(router, 'navigate');
    component.subscriptions = MAPPED_SUBSCRIPTIONS;

    component.manageSubscription(MAPPED_SUBSCRIPTIONS[1]);
    tick(1000);

    expect(router.navigate).toHaveBeenCalledWith(['profile/subscriptions']);
  }));

  it('should redirect to profile if action is present and subscription changed and user is not featured', fakeAsync(() => {
    spyOn(modalService, 'open').and.returnValue({
      result: Promise.resolve(true),
      componentInstance: componentInstance,
    });
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
    spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
    spyOn(router, 'navigate');

    component.user = MOCK_FULL_USER_NON_FEATURED;
    component.manageSubscription(MAPPED_SUBSCRIPTIONS[1]);
    tick(1000);

    expect(router.navigate).toHaveBeenCalledWith(['profile/info']);
  }));

  it('should redirect to subscriptions if action is present and user is featured', fakeAsync(() => {
    spyOn(modalService, 'open').and.returnValue({
      result: Promise.resolve('add'),
      componentInstance: componentInstance,
    });
    spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_ADDED));
    spyOn(router, 'navigate');
    component.subscriptions = MAPPED_SUBSCRIPTIONS;

    component.subscriptionChangeSuccessful();
    tick(1000);

    expect(router.navigate).toHaveBeenCalledWith(['profile/subscriptions']);
  }));

  it('should redirect to profile if action is present and subscription changed and user is not featured', fakeAsync(() => {
    spyOn(modalService, 'open').and.returnValue({
      result: Promise.resolve('add'),
      componentInstance: componentInstance,
    });
    spyOn(router, 'navigate');

    component.user = MOCK_FULL_USER_NON_FEATURED;
    component.subscriptionChangeSuccessful();

    tick(1000);

    expect(router.navigate).toHaveBeenCalledWith(['profile/info']);
  }));

  describe('when the user is subscribed to the selected category', () => {
    it('should send the edit subscription click event', () => {
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickProfileEditCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickProfileEditCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.ProfileSubscription,
          tier: MAPPED_SUBSCRIPTIONS_ADDED[0].selected_tier_id,
          subscription: MAPPED_SUBSCRIPTIONS_ADDED[0].category_id as SUBSCRIPTION_CATEGORIES,
        },
      };

      component.manageSubscription(MAPPED_SUBSCRIPTIONS_ADDED[0]);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });

    describe('and the subscription is from Android or iOS', () => {
      it('should open a modal that says to modify subscription in app', () => {
        spyOn(subscriptionsService, 'isSubscriptionInApp').and.returnValue(true);
        spyOn(modalService, 'open').and.callThrough();

        component.manageSubscription(MAPPED_SUBSCRIPTIONS_WITH_INAPP[0]);

        expect(modalService.open).toHaveBeenCalledWith(CheckSubscriptionInAppModalComponent, {
          windowClass: 'review',
        });
      });
    });

    describe('and the subscription has only one tier', () => {
      it('should open the cancel modal', () => {
        spyOn(modalService, 'open').and.callThrough();

        component.manageSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED);

        expect(modalService.open).toHaveBeenCalledWith(CancelSubscriptionModalComponent, {
          windowClass: 'review',
        });
      });
    });
  });

  describe('when the user has cancelled the subscription', () => {
    it('should open the continue subscribed modal', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.manageSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED);

      expect(modalService.open).toHaveBeenCalledWith(ContinueSubscriptionModalComponent, {
        windowClass: 'review',
      });
    });

    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      spyOn(modalService, 'open').and.callThrough();
      const expectedEvent: AnalyticsEvent<ClickKeepCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickKeepCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          subscription: MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED.category_id as SUBSCRIPTION_CATEGORIES,
          tier: MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED.selected_tier_id,
          screenId: SCREEN_IDS.ProfileSubscription,
        },
      };

      component.manageSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('when the user is NOT subscribed to the selected category and has another subscription', () => {
    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickSubscriptionManagementPlus> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionManagementPlus,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagement,
          subscription: SUBSCRIPTIONS_NOT_SUB[0].category_id as SUBSCRIPTION_CATEGORIES,
          isNewSubscriber: false,
          freeTrial: SUBSCRIPTIONS_NOT_SUB[0].trial_available,
        },
      };

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });

    it('should open a unsubscribe inapp first modal if one subscription is inapp and selected sub is not active', () => {
      spyOn(subscriptionsService, 'isOneSubscriptionInApp').and.returnValue(true);
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);
      spyOn(modalService, 'open').and.callThrough();

      component.manageSubscription(MAPPED_SUBSCRIPTIONS_WITH_INAPP[1]);

      expect(modalService.open).toHaveBeenCalledWith(UnsubscribeInAppFirstModal, {
        windowClass: 'review',
      });
    });
  });

  describe('when the user is NOT subscribed to the selected category and no other category', () => {
    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      spyOn(subscriptionsService, 'hasOneStripeSubscription').and.returnValue(false);
      const expectedEvent: AnalyticsEvent<ClickSubscriptionManagementPlus> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionManagementPlus,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagement,
          subscription: MAPPED_SUBSCRIPTIONS[0].category_id as SUBSCRIPTION_CATEGORIES,
          isNewSubscriber: true,
          freeTrial: SUBSCRIPTIONS_NOT_SUB[0].trial_available,
        },
      };

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  describe('when the user click subscription without free trial', () => {
    it('should send event to analytics', () => {
      spyOn(analyticsService, 'trackEvent');
      spyOn(subscriptionsService, 'hasOneStripeSubscription').and.returnValue(false);
      const expectedEvent: AnalyticsEvent<ClickSubscriptionManagementPlus> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionManagementPlus,
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagement,
          subscription: MAPPED_SUBSCRIPTIONS[0].category_id as SUBSCRIPTION_CATEGORIES,
          isNewSubscriber: true,
          freeTrial: MAPPED_SUBSCRIPTIONS[0].trial_available,
        },
      };

      component.manageSubscription(MAPPED_SUBSCRIPTIONS[0]);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});

afterAll(() => {
  TestBed.resetTestingModule();
});
