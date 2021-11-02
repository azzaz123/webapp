import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickProfileEditCurrentSubscription,
  ClickProSubscription,
  SCREEN_IDS,
  ViewSubscription,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CategoryService } from '@core/category/category.service';
import { EventService } from '@core/event/event.service';
import { SUBSCRIPTION_CATEGORIES } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { CATEGORY_DATA_WEB } from '@fixtures/category.fixtures.spec';
import {
  SUBSCRIPTIONS,
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_CANCELLED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL,
} from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_FULL_USER, MOCK_FULL_USER_FEATURED, USER_DATA } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/core/user/user.service';
import { of } from 'rxjs';
import { SubscriptionsComponent } from './subscription.component';
import { By } from '@angular/platform-browser';
import { CancelSubscriptionModalComponent } from '../../modal/cancel-subscription/cancel-subscription-modal.component';
import { ContinueSubscriptionModalComponent } from '../../modal/continue-subscription/continue-subscription-modal.component';
import { PRO_PATHS } from '../../pro-routing-constants';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';

@Component({
  selector: 'tsl-subscription-purchase',
  template: '',
})
class MockNewSubscriptionComponent {}

@Component({
  selector: 'tsl-subscription-edit',
  template: '',
})
class MockEditSubscriptionComponent {}

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
  let benefitsService: SubscriptionBenefitsService;
  const componentInstance = { subscription: SUBSCRIPTIONS[0] };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubscriptionsComponent, MockNewSubscriptionComponent, MockEditSubscriptionComponent],
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
          {
            provide: SubscriptionBenefitsService,
            useClass: MockSubscriptionBenefitsService,
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
    benefitsService = TestBed.inject(SubscriptionBenefitsService);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should get the mapped subscriptions', () => {
      spyOn(categoryService, 'getCategories').and.callThrough();
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(SUBSCRIPTIONS));

      component.ngOnInit();

      expect(component.subscriptions).toEqual(SUBSCRIPTIONS);
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
        spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL));

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

      component.manageSubscription(SUBSCRIPTIONS[0]);
      fixture.detectChanges();

      const newSubscriptionComponent = fixture.debugElement.query(By.directive(MockNewSubscriptionComponent));
      expect(newSubscriptionComponent).toBeTruthy();
    });

    it('should not show Edit Subscription when subscription is not active', () => {
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);

      component.manageSubscription(SUBSCRIPTIONS[0]);
      fixture.detectChanges();

      const editSubscriptionComponent = fixture.debugElement.query(By.directive(MockEditSubscriptionComponent));
      expect(editSubscriptionComponent).toBeFalsy();
    });

    it('should not show show benefits header', () => {
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);
      spyOn(benefitsService.showHeaderBenefits, 'next').and.callThrough();

      component.manageSubscription(SUBSCRIPTIONS[0]);
      fixture.detectChanges();

      expect(benefitsService.showHeaderBenefits.next).toBeCalledWith(false);
    });

    it('should not set loading to true if action is not present', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve(undefined),
        componentInstance: componentInstance,
      });
      component.subscriptions = SUBSCRIPTIONS;

      component.manageSubscription(SUBSCRIPTIONS[0]);

      expect(component.loading).toBe(false);
    }));

    it('should not load if it is updating', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('update'),
        componentInstance: componentInstance,
      });
      component.subscriptions = SUBSCRIPTIONS;

      component.manageSubscription(SUBSCRIPTIONS[0]);
      tick(400000);

      expect(component.loading).toBe(false);
    }));

    describe('clear data', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);
        spyOn(benefitsService.showHeaderBenefits, 'next').and.callThrough();

        component.manageSubscription(SUBSCRIPTIONS[0]);
        component.onunselectSubscription();
        fixture.detectChanges();
      });
      it('should clear data', () => {
        const newSubscriptionComponent = fixture.debugElement.query(By.directive(MockNewSubscriptionComponent));
        expect(newSubscriptionComponent).toBeFalsy();
        expect(component.newSubscription).toBeFalsy();
      });
      it('should show benefits header', () => {
        expect(benefitsService.showHeaderBenefits.next).toBeCalledWith(true);
      });
    });
  });

  describe('Edit subscription flow', () => {
    it('should show edit subscription form when subscription is active', () => {
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);

      component.manageSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED);
      fixture.detectChanges();

      const editSubscriptionComponent = fixture.debugElement.query(By.directive(MockEditSubscriptionComponent));
      expect(editSubscriptionComponent).toBeTruthy();
    });

    it('should not show new subscription when subscription is active', () => {
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);

      component.manageSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED);
      fixture.detectChanges();

      const newSubscriptionComponent = fixture.debugElement.query(By.directive(MockNewSubscriptionComponent));
      expect(newSubscriptionComponent).toBeFalsy();
    });

    it('should not show show benefits header', () => {
      spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(false);
      spyOn(benefitsService.showHeaderBenefits, 'next').and.callThrough();

      component.manageSubscription(SUBSCRIPTIONS[0]);
      fixture.detectChanges();

      expect(benefitsService.showHeaderBenefits.next).toBeCalledWith(false);
    });

    it('should not open modal', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      component.subscriptions = [MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED];

      component.manageSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED);

      expect(modalService.open).not.toHaveBeenCalled();
    }));

    describe('clear data', () => {
      beforeEach(() => {
        spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
        spyOn(benefitsService.showHeaderBenefits, 'next').and.callThrough();

        component.manageSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED);
        component.onunselectSubscription();
        fixture.detectChanges();
      });
      it('should clear data', () => {
        const editSubscriptionComponent = fixture.debugElement.query(By.directive(MockEditSubscriptionComponent));

        expect(editSubscriptionComponent).toBeFalsy();
        expect(component.editSubscription).toBeFalsy();
      });
      it('should show benefits header', () => {
        expect(benefitsService.showHeaderBenefits.next).toBeCalledWith(true);
      });
    });
  });

  describe('and purchase is succesful', () => {
    describe('and the user is pro', () => {
      beforeEach(() => {
        component.user.featured = true;
      });
      describe('and has to go to profile', () => {
        it('should redirect', fakeAsync(() => {
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED));
          spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
          spyOn(router, 'navigate');
          component.subscriptions = [MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED];

          component.subscriptionChangeSuccessful(`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`);
          tick(1000);

          expect(router.navigate).toHaveBeenCalledWith([`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`]);
        }));
      });
      describe('and has not to go to profile', () => {
        it('should redirect', fakeAsync(() => {
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED));
          spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
          spyOn(router, 'navigate');
          component.subscriptions = [MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED];

          component.subscriptionChangeSuccessful();
          tick(1000);

          expect(router.navigate).not.toHaveBeenCalledWith();
        }));
      });
    });
  });

  describe('and purchase is succesful', () => {
    describe('and the user not pro', () => {
      beforeEach(() => {
        component.user.featured = false;
      });
      describe('and has to go to profile', () => {
        it('should redirect', fakeAsync(() => {
          jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED));
          spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
          spyOn(router, 'navigate');
          component.subscriptions = [MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED];

          component.subscriptionChangeSuccessful(`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`);
          tick(2000);

          expect(router.navigate).toHaveBeenCalledWith([`${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`]);
        }));
      });
      describe('and has not to go to profile', () => {
        it('should redirect', fakeAsync(() => {
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED));
          spyOn(subscriptionsService, 'isStripeSubscription').and.returnValue(true);
          spyOn(router, 'navigate');
          component.subscriptions = [MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED];

          component.subscriptionChangeSuccessful();
          tick(2000);

          expect(router.navigate).not.toHaveBeenCalledWith();
        }));
      });
    });
  });

  describe('when the user is subscribed to the selected category', () => {
    it('should send the edit subscription click event', () => {
      spyOn(analyticsService, 'trackEvent');
      const expectedEvent: AnalyticsEvent<ClickProfileEditCurrentSubscription> = {
        name: ANALYTICS_EVENT_NAMES.ClickProfileEditCurrentSubscription,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.ProfileSubscription,
          tier: SUBSCRIPTIONS[0].selected_tier_id,
          subscription: SUBSCRIPTIONS[0].category_id as SUBSCRIPTION_CATEGORIES,
        },
      };

      component.manageSubscription(SUBSCRIPTIONS[0]);

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
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
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});

afterAll(() => {
  TestBed.resetTestingModule();
});
