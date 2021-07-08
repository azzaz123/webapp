import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { FeatureflagService } from '@core/user/featureflag.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_USER_STATS_RESPONSE, USER_DATA, USER_WEB_SLUG } from '@fixtures/user.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { UserProfileRoutePipe } from '@shared/pipes';
import { ProBadgeComponent } from '@shared/pro-badge/pro-badge.component';
import { StarsComponent } from '@shared/stars/stars.component';
import { APP_PATHS } from 'app/app-routing-constants';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;
  let permissionService: NgxPermissionsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
        declarations: [ProfileComponent, StarsComponent, ProBadgeComponent, UserProfileRoutePipe],
        providers: [
          NgxPermissionsService,
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
          FeatureFlagService,
          {
            provide: UserService,
            useClass: MockedUserService,
          },
          {
            provide: 'SUBDOMAIN',
            useValue: 'www',
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
      permissionService = TestBed.inject(NgxPermissionsService);
      fixture.detectChanges();
    })
  );

  afterAll(() => httpMock.verify());

  const mockBeforeEachInit = () => {
    component.ngOnInit();

    fixture.detectChanges();
  };

  describe('when the component loads', () => {
    it('should set correctly the public url link', () => {
      component.user.webSlug = USER_WEB_SLUG;
      const expectedPublicProfileRoute = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.USER_DETAIL}/${USER_DATA.web_slug}`;

      fixture.detectChanges();
      const publicProfileUrlHTML = fixture.debugElement.query(By.css('.header-row > .header-link'));
      const routerLinkInstance = publicProfileUrlHTML.injector.get(RouterLinkWithHref);

      expect(routerLinkInstance['href']).toEqual(expectedPublicProfileRoute);
    });

    it('should show user review numbers and stars', () => {
      component.userStats.counters.reviews = 2;

      fixture.detectChanges();
      const expectedUserReviewsText = MOCK_USER_STATS_RESPONSE.counters.find((r) => r.type === 'reviews').value.toString();
      const userReviewsText: string = fixture.debugElement.query(By.css('.reviews-rating-value')).nativeElement.innerHTML;
      const userStars: number = fixture.debugElement.query(By.directive(StarsComponent)).componentInstance.stars;
      const userStarsCondition = userStars >= 0 && userStars <= 5;

      expect(userReviewsText).toEqual(expectedUserReviewsText);
      expect(userStarsCondition).toBe(true);
    });

    describe('and the user is not a pro user', () => {
      it('should not show a PRO badge', () => {
        jest.spyOn(userService, 'isPro', 'get').mockReturnValue(false);

        fixture.detectChanges();

        const proBadgeComponentElement = fixture.debugElement.query(By.directive(ProBadgeComponent));
        expect(proBadgeComponentElement).toBeFalsy();
      });
    });

    describe('and the user is a pro user', () => {
      beforeEach(() => {
        jest.spyOn(userService, 'isPro', 'get').mockReturnValue(true);
      });
      describe('and has subscriptions permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
        });
        it('should show a PRO badge', () => {
          fixture.detectChanges();

          const proBadgeComponentElement = fixture.debugElement.query(By.directive(ProBadgeComponent));
          expect(proBadgeComponentElement).toBeTruthy();
        });
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should show a PRO badge', () => {
          fixture.detectChanges();

          const proBadgeComponentElement = fixture.debugElement.query(By.directive(ProBadgeComponent));
          expect(proBadgeComponentElement).toBeFalsy();
        });
      });
    });
  });

  describe('when clicking on logout button', () => {
    it('should perform logout logic', () => {
      mockBeforeEachInit();
      spyOn(userService, 'logout').and.callThrough();
      const logoutButton: HTMLElement = fixture.debugElement.query(By.css('.btn-logout')).nativeElement;

      logoutButton.click();

      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
