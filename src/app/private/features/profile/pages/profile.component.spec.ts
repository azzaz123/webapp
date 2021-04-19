import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { I18nService } from '@core/i18n/i18n.service';
import { FeatureflagService } from '@core/user/featureflag.service';
import { UserService, USER_ENDPOINT, USER_STATS_ENDPOINT } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_NON_FEATURED_USER_RESPONSE, MOCK_USER_STATS_RESPONSE, USER_DATA } from '@fixtures/user.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { UserProfileRoutePipe } from '@shared/pipes';
import { ProBadgeComponent } from '@shared/pro-badge/pro-badge.component';
import { StarsComponent } from '@shared/stars/stars.component';
import { APP_PATHS } from 'app/app-routing-constants';
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
import { NgxPermissionsModule } from 'ngx-permissions';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;
  let analyticsService: AnalyticsService;
  let subscriptionsService: SubscriptionsService;
  let i18n: I18nService;
  let hasOneTrialSubscription = false;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
        declarations: [ProfileComponent, StarsComponent, ProBadgeComponent, UserProfileRoutePipe],
        providers: [
          EventService,
          {
            provide: I18nService,
            useValue: {
              getTranslations() {},
            },
          },
          AccessTokenService,
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
          UserService,
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
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
      analyticsService = TestBed.inject(AnalyticsService);
      subscriptionsService = TestBed.inject(SubscriptionsService);
      i18n = TestBed.inject(I18nService);
      fixture.detectChanges();
    })
  );

  afterAll(() => httpMock.verify());

  const mockBeforeEachInit = (isFeaturedUser?: boolean) => {
    component.ngOnInit();

    const userMeReq = httpMock.match((req) => req.urlWithParams === `${environment.baseUrl}${USER_ENDPOINT}`)[0];
    if (isFeaturedUser) {
      userMeReq.flush(USER_DATA);
    } else {
      userMeReq.flush(MOCK_NON_FEATURED_USER_RESPONSE);
    }

    httpMock.match((req) => req.urlWithParams === `${environment.baseUrl}${USER_STATS_ENDPOINT}`)[0].flush(MOCK_USER_STATS_RESPONSE);

    fixture.detectChanges();
  };

  describe('when the component loads', () => {
    it('should set correctly the public url link', () => {
      mockBeforeEachInit();
      const expectedPublicProfileRoute = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${USER_DATA.web_slug}`;
      const publicProfileUrlHTML = fixture.debugElement.query(By.css('.header-row > .header-link'));
      const routerLinkInstance = publicProfileUrlHTML.injector.get(RouterLinkWithHref);

      expect(routerLinkInstance['href']).toEqual(expectedPublicProfileRoute);
    });

    it('should show user review numbers and stars', () => {
      mockBeforeEachInit();
      const expectedUserReviewsText = MOCK_USER_STATS_RESPONSE.counters.find((r) => r.type === 'reviews').value.toString();
      const userReviewsText: string = fixture.debugElement.query(By.css('.reviews-rating-value')).nativeElement.innerHTML;
      const userStars: number = fixture.debugElement.query(By.directive(StarsComponent)).componentInstance.stars;
      const userStarsCondition = userStars >= 0 && userStars <= 5;

      expect(userReviewsText).toEqual(expectedUserReviewsText);
      expect(userStarsCondition).toBe(true);
    });

    describe('and the user is not a pro user', () => {
      it('should not show a PRO badge', () => {
        mockBeforeEachInit();

        const proBadgeHTML = fixture.debugElement.query(By.directive(ProBadgeComponent)).childNodes[0].nativeNode;
        expect(proBadgeHTML.hasAttribute('hidden')).toBe(true);
        expect(component.isPro).toBe(false);
      });
    });

    describe('and the user is a pro user', () => {
      it('should show a PRO badge', () => {
        mockBeforeEachInit(true);

        const proBadgeHTML = fixture.debugElement.query(By.directive(ProBadgeComponent)).childNodes[0].nativeNode;
        expect(proBadgeHTML.hasAttribute('hidden')).toBe(false);
        expect(component.isPro).toBe(true);
      });
    });
  });

  describe('when clicking on logout button', () => {
    it('should perform logout logic', () => {
      mockBeforeEachInit();
      spyOn(userService, 'logout');
      const logoutButton: HTMLElement = fixture.debugElement.query(By.css('.btn-logout')).nativeElement;

      logoutButton.click();

      expect(userService.logout).toHaveBeenCalled();
    });
  });

  describe('when user is not a cardealer', () => {
    describe('and the user is not a PRO', () => {
      let subscriptionTabElement;
      it('should should show tab title Become a PRO', () => {
        const expectedText = 'Become a PRO';
        spyOn(i18n, 'getTranslations').and.returnValue(expectedText);

        fixture.detectChanges();

        subscriptionTabElement = fixture.debugElement
          .queryAll(By.css('a'))
          .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

        expect(i18n.getTranslations).toHaveBeenCalledWith('becomePro');
        expect(subscriptionTabElement).toBeTruthy();
      });
    });

    describe('and the user is PRO', () => {
      let subscriptionTabElement;
      it('should should show tab title Wallapop PRO', () => {
        const expectedText = 'Wallapop PRO';
        spyOn(i18n, 'getTranslations').and.returnValue(expectedText);
        jest.spyOn(userService, 'isPro', 'get').mockReturnValue(true);

        fixture.detectChanges();

        subscriptionTabElement = fixture.debugElement
          .queryAll(By.css('a'))
          .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;

        expect(i18n.getTranslations).toHaveBeenCalledWith('wallapopPro');
        expect(subscriptionTabElement).toBeTruthy();
      });
    });

    describe("and when user clicks in 'Subscriptions' tab", () => {
      let subscriptionTabElement;

      beforeEach(() => {
        const expectedText = 'Become a PRO';
        spyOn(analyticsService, 'trackEvent');
        spyOn(i18n, 'getTranslations').and.returnValue(expectedText);

        fixture.detectChanges();

        subscriptionTabElement = fixture.debugElement
          .queryAll(By.css('a'))
          .find((anchors) => anchors.nativeElement.innerHTML === expectedText).nativeElement;
      });

      describe('and there is no free trial', () => {
        beforeEach(() => spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(false));

        it('should track the event', () => {
          const expectedEvent: AnalyticsEvent<ClickProSubscription> = {
            name: ANALYTICS_EVENT_NAMES.ClickProSubscription,
            eventType: ANALYTIC_EVENT_TYPES.Navigation,
            attributes: {
              screenId: SCREEN_IDS.MyProfile,
              freeTrial: false,
            },
          };

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });

      describe('and there is free trial', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasOneTrialSubscription').and.returnValue(true);
          component.ngOnInit();
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

          subscriptionTabElement.click();

          expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        });
      });
    });
  });
});
