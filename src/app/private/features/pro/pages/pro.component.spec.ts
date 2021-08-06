import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickProSubscription,
  SCREEN_IDS,
} from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { ProComponent } from './pro.component';
import { SubscriptionsComponent } from './subscription/subscription.component';

describe('ProComponent', () => {
  let component: ProComponent;
  let fixture: ComponentFixture<ProComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;
  let analyticsService: AnalyticsService;
  let subscriptionsService: SubscriptionsService;
  let i18n: I18nService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NgxPermissionsModule.forRoot(),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([{ path: 'subscriptions', component: SubscriptionsComponent }]),
        ],
        declarations: [ProComponent],
        providers: [
          NgxPermissionsService,
          {
            provide: CookieService,
            useValue: {
              value: null,
              put() {},
              get() {
                return this.value;
              },
            },
          },
          FeatureFlagService,
          {
            provide: UserService,
            useClass: MockedUserService,
          },
          {
            provide: 'SUBDOMAIN',
            useValue: 'www',
          },
          {
            provide: SubscriptionsService,
            useClass: MockSubscriptionService,
          },
          {
            provide: AnalyticsService,
            useClass: MockAnalyticsService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(ProComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
      analyticsService = TestBed.inject(AnalyticsService);
      subscriptionsService = TestBed.inject(SubscriptionsService);
      i18n = TestBed.inject(I18nService);
      fixture.detectChanges();
    })
  );

  describe('when user is not a cardealer', () => {
    describe("and when user clicks in 'Subscriptions' tab", () => {
      let subscriptionTabElement;
      const expectedText = 'Subscriptions';
      beforeEach(() => {
        spyOn(analyticsService, 'trackEvent');
      });

      describe('and there is no free trial', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(false);
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: false,
              discount: false,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and there is free trial', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: true,
              discount: false,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and there is a discount', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasSomeSubscriptionDiscount').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: false,
              discount: true,
            },
          };
          subscriptionTabElement = fixture.debugElement
            .queryAll(By.css('a'))
            .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });
  });
});
