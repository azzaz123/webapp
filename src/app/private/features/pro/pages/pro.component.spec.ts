import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { FeatureflagService } from '@core/user/featureflag.service';
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
            provide: I18nService,
            useValue: {
              translate() {},
            },
          },
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
          FeatureflagService,
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
    describe('and the user is not a PRO', () => {
      let subscriptionTabElement;
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should should show tab title Become a PRO', () => {
        const expectedText = 'Become a PRO';
        spyOn(i18n, 'translate').and.returnValue(expectedText);

        fixture.detectChanges();

        subscriptionTabElement = fixture.debugElement
          .queryAll(By.css('a'))
          .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

        expect(i18n.translate).toHaveBeenCalledWith(TRANSLATION_KEY.BECOME_PRO);
        expect(subscriptionTabElement).toBeTruthy();
      });
    });

    describe('and the user is PRO', () => {
      let subscriptionTabElement;
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should should show tab title Wallapop PRO', () => {
        const expectedText = 'Wallapop PRO';
        spyOn(i18n, 'translate').and.returnValue(expectedText);
        jest.spyOn(userService, 'isPro', 'get').mockReturnValue(true);

        fixture.detectChanges();

        subscriptionTabElement = fixture.debugElement
          .queryAll(By.css('a'))
          .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

        expect(i18n.translate).toHaveBeenCalledWith(TRANSLATION_KEY.WALLAPOP_PRO);
        expect(subscriptionTabElement).toBeTruthy();
      });
    });

    describe("and when user clicks in 'Subscriptions' tab", () => {
      let subscriptionTabElement;
      const expectedText = 'Become a PRO';
      beforeEach(() => {
        spyOn(analyticsService, 'trackEvent');
        spyOn(i18n, 'translate').and.returnValue(expectedText);

        fixture.detectChanges();
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
