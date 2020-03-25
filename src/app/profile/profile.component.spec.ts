import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { UserService, USER_ENDPOINT, USER_STATS_ENDPOINT } from '../core/user/user.service';
import { Observable } from 'rxjs';
import { MOCK_USER, MOTORPLAN_DATA, USER_WEB_SLUG, MOCK_USER_STATS, PROFILE_SUB_INFO, PROFILE_NOT_SUB_INFO, PROFILE_ELIGIBLE_INFO, PROFILE_ACTIVE_INFO, MOCK_FULL_USER, USER_DATA, MOCK_NON_FEATURED_USER_RESPONSE, MOCK_USER_STATS_RESPONSE } from '../../tests/user.fixtures.spec';
import { I18nService } from '../core/i18n/i18n.service';
import { environment } from '../../environments/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { HttpService } from '../core/http/http.service';
import { FeatureflagService } from '../core/user/featureflag.service';
import { SUBSCRIPTIONS, SUBSCRIPTIONS_NOT_SUB } from '../../tests/subscriptions.fixtures.spec';
import { EventService } from '../core/event/event.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HaversineService } from 'ng2-haversine';
import { AccessTokenService } from '../core/http/access-token.service';
import { CookieService, CookieOptionsProvider } from 'ngx-cookie';
import { SplitTestService } from '../core/tracking/split-test.service';
import { By } from '@angular/platform-browser';
import { StarsComponent } from '../shared/stars/stars.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot(), HttpClientTestingModule],
      declarations: [ ProfileComponent, StarsComponent ],
      providers: [
        {provide: HttpService, useValue: {}},
        EventService,
        I18nService,
        HaversineService,
        AccessTokenService,
        {
          provide: CookieService, useValue: {
          value: null,
            put() {
            },
            get () {
              return this.value;
            }
          }
        },
        FeatureflagService,
        SplitTestService,
        UserService,
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  }));

  afterAll(() => httpMock.verify());

  describe('when the component loads', () => {

    const mockBeforeEach = (isFeaturedUser?: boolean) => {
      component.ngOnInit();

      const userMeReq = httpMock.match(req => req.urlWithParams === `${environment.baseUrl}${USER_ENDPOINT}`)[0];
      if (isFeaturedUser) {
        userMeReq.flush(USER_DATA);
      } else {
        userMeReq.flush(MOCK_NON_FEATURED_USER_RESPONSE)
      }

      httpMock.match(req => req.urlWithParams === `${environment.baseUrl}${USER_STATS_ENDPOINT}`)[0].flush(MOCK_USER_STATS_RESPONSE);

      fixture.detectChanges();
    }

    it('should set correctly the public url link', () => {
      mockBeforeEach();
      const expectedPublicProfileUrl = `${environment.siteUrl.replace('es', 'www')}user/${USER_DATA.web_slug}`;
      const publicProfileUrlHTML: HTMLElement = fixture.debugElement.query(By.css('.header-row > .header-link')).nativeElement;

      expect(publicProfileUrlHTML.getAttribute('href')).toEqual(expectedPublicProfileUrl);
      expect(component.userUrl).toEqual(expectedPublicProfileUrl);
    });

    it('should show user review numbers and stars', () => {
      mockBeforeEach();
      const expectedUserReviewsText = MOCK_USER_STATS_RESPONSE.counters.find(r => r.type === 'reviews').value.toString();
      const expectedUserStars = userService.toRatingsStats(MOCK_USER_STATS_RESPONSE.ratings).reviews;
      const userReviewsText: string = fixture.debugElement.query(By.css('.reviews-rating-value')).nativeElement.innerHTML;
      const userStars: number = fixture.debugElement.query(By.directive(StarsComponent)).componentInstance.stars;
      const userStarsCondition = userStars >= 0 && userStars <= 5;

      expect(userReviewsText).toEqual(expectedUserReviewsText);
      expect(userStarsCondition).toBe(true);
    });

    describe('and the user is not a pro user', () => {
      it('should not show a PRO badge', () => {
        mockBeforeEach();

        // TODO: Would be nice to refactor this badge into a component
        const proBadgeParentRef = fixture.debugElement.query(By.css('.badge-pro'));

        expect(proBadgeParentRef).toBeFalsy();
        expect(component.isPro).toBe(false);
      })
    });

    describe('and the user is featured', () => {
      it('should show a PRO badge', () => {
        mockBeforeEach(true);

        // TODO: Would be nice to refactor this badge into a component
        const proBadgeParentRef = fixture.debugElement.query(By.css('.badge-pro'));

        expect(proBadgeParentRef).toBeTruthy();
        expect(component.isPro).toBe(true);
      })
    });
  });

  describe('when clicking on logout button', () => {
    it('should perform logout logic', () => {
      spyOn(userService, 'logout');
      const logoutButton: HTMLElement = fixture.debugElement.query(By.css('.btn-logout')).nativeElement;

      logoutButton.click();

      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
