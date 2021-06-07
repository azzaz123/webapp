import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { SlugsUtilService } from '@core/services/slugs-util/slugs-util.service';
import { UserService } from '@core/user/user.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { IsCurrentUserPipeMock } from '@fixtures/is-current-user.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { AdComponentStub } from '@fixtures/shared';
import { IMAGE, MockedUserService, MOCK_FULL_USER_FEATURED, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { of, Subject, throwError } from 'rxjs';
import { PUBLIC_PROFILE_AD } from '../core/ads/public-profile-ads.config';
import { MockUserProfileTrackEventService } from '../core/services/public-profile-tracking-events/public-profile-tracking-events.fixtures.spec';
import { PublicProfileTrackingEventsService } from '../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
import { PublicProfileService } from '../core/services/public-profile.service';
import { PUBLIC_PROFILE_PATHS } from '../public-profile-routing-constants';
import { PublicProfileComponent } from './public-profile.component';

describe('PublicProfileComponent', () => {
  const containerSelector = '.PublicProfile';
  const favouriteUserTag = 'tsl-favourite-user';
  let component: PublicProfileComponent;
  let fixture: ComponentFixture<PublicProfileComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let publicProfileService: PublicProfileService;
  let mockDeviceService;
  let isCurrentUserPipe: IsCurrentUserPipe;
  let publicProfileTrackingEventsService: PublicProfileTrackingEventsService;

  const routerEvents: Subject<any> = new Subject();

  beforeEach(async () => {
    mockDeviceService = {
      isMobile: () => true,
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PublicProfileComponent, IsCurrentUserStub, AdComponentStub],
      providers: [
        {
          provide: PublicProfileTrackingEventsService,
          useClass: MockUserProfileTrackEventService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              webSlug: 'user-generic-123',
            }),
          },
        },
        {
          provide: PublicProfileService,
          useValue: {
            getUser() {
              return of(MOCK_FULL_USER_FEATURED);
            },
            getStats() {
              return of(MOCK_USER_STATS);
            },
            getShippingCounter() {
              return of(1);
            },
            getCoverImage() {
              return of(IMAGE);
            },
            isFavourite() {
              return of({
                favorited: false,
              });
            },
          },
        },
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
            url: PUBLIC_PROFILE_PATHS.REVIEWS,
            events: routerEvents,
          },
        },
        { provide: UserService, useClass: MockedUserService },
        { provide: IsCurrentUserPipe, useClass: IsCurrentUserPipeMock },
        SlugsUtilService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    isCurrentUserPipe = TestBed.inject(IsCurrentUserPipe);
    publicProfileService = TestBed.inject(PublicProfileService);
    publicProfileTrackingEventsService = TestBed.inject(PublicProfileTrackingEventsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we access to a public profile...', () => {
    describe('when we have the user id...', () => {
      describe('and we get the user...', () => {
        it('should show the page if we have the user id', () => {
          const containerPage = fixture.debugElement.query(By.css(containerSelector));

          expect(containerPage).toBeTruthy();
          expect(component.userId).toBe('123');
        });

        it('should call for more data', () => {
          spyOn(publicProfileService, 'getUser');
          spyOn(publicProfileService, 'getStats');
          spyOn(publicProfileService, 'getShippingCounter');

          component.ngOnInit();

          expect(publicProfileService.getUser).toHaveBeenCalledTimes(1);
          expect(publicProfileService.getStats).toHaveBeenCalledTimes(1);
          expect(publicProfileService.getShippingCounter).toHaveBeenCalledTimes(1);
        });

        describe('when the user is featured...', () => {
          it('should request the cover image', () => {
            spyOn(publicProfileService, 'getCoverImage');

            component.ngOnInit();

            expect(publicProfileService.getCoverImage).toHaveBeenCalledTimes(1);
          });
        });

        describe('when the user is NOT featured...', () => {
          it('should NOT request the cover image', () => {
            component.userInfo.featured = false;
            spyOn(publicProfileService, 'getCoverImage');

            component.ngOnInit();

            expect(publicProfileService.getCoverImage).not.toHaveBeenCalled();
          });
        });

        describe('when is our own user...', () => {
          beforeEach(() => {
            spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
          });
          it('should NOT ask for the favourited user flag', () => {
            spyOn(publicProfileService, 'isFavourite');

            component.ngOnInit();

            expect(publicProfileService.isFavourite).not.toHaveBeenCalled();
          });

          it('should send view own profile event', () => {
            spyOn(publicProfileTrackingEventsService, 'trackViewOwnProfile');
            spyOn(publicProfileTrackingEventsService, 'trackViewOtherProfile');

            component.ngOnInit();

            expect(publicProfileTrackingEventsService.trackViewOwnProfile).toHaveBeenCalledWith(component.userInfo.featured);
            expect(publicProfileTrackingEventsService.trackViewOtherProfile).not.toHaveBeenCalled();
          });

          describe('when we click on Reviews tab...', () => {
            it('should send track view own reviews', () => {
              spyOn(publicProfileTrackingEventsService, 'trackViewOwnReviewsorViewOtherReviews');

              routerEvents.next(new NavigationEnd(1, PUBLIC_PROFILE_PATHS.REVIEWS, PUBLIC_PROFILE_PATHS.PUBLISHED));

              expect(publicProfileTrackingEventsService.trackViewOwnReviewsorViewOtherReviews).toHaveBeenLastCalledWith(
                component.userInfo,
                component.userStats,
                true
              );
            });
          });
        });

        describe('when is NOT our own user...', () => {
          beforeEach(() => {
            spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
          });

          it('should ask for the favourited user flag', () => {
            spyOn(publicProfileService, 'isFavourite');

            component.ngOnInit();

            expect(publicProfileService.isFavourite).toHaveBeenCalled();
          });

          it('should send view other profile event', () => {
            spyOn(publicProfileTrackingEventsService, 'trackViewOtherProfile');
            spyOn(publicProfileTrackingEventsService, 'trackViewOwnProfile');

            component.ngOnInit();

            expect(publicProfileTrackingEventsService.trackViewOtherProfile).toHaveBeenCalledWith(
              component.userInfo,
              component.userStats.counters.publish
            );
            expect(publicProfileTrackingEventsService.trackViewOwnProfile).not.toHaveBeenCalled();
          });

          describe('when we click on Reviews tab...', () => {
            it('should send track view other reviews event', () => {
              spyOn(publicProfileTrackingEventsService, 'trackViewOwnReviewsorViewOtherReviews');

              component.ngOnInit();

              expect(publicProfileTrackingEventsService.trackViewOwnReviewsorViewOtherReviews).toHaveBeenLastCalledWith(
                component.userInfo,
                component.userStats,
                false
              );
            });
          });

          describe('and the user is favourited...', () => {
            it('should update isFavourited flag to true', () => {
              spyOn(publicProfileService, 'isFavourite').and.returnValue(of({ favorited: true }));

              component.ngOnInit();

              expect(component.isFavourited).toBe(true);
            });

            it('should send favourite user event', () => {
              spyOn(publicProfileTrackingEventsService, 'trackFavouriteOrUnfavouriteUserEvent');
              const toggleFavourite = fixture.debugElement.query(By.css(favouriteUserTag));

              toggleFavourite.triggerEventHandler('userFavouriteChanged', true);

              expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteUserEvent).toHaveBeenCalledWith(
                component.userInfo,
                true
              );
            });
          });

          describe('and the user is NOT favourited...', () => {
            it('should update isFavourited flag to false', () => {
              spyOn(publicProfileService, 'isFavourite').and.returnValue(of({ favorited: false }));

              component.ngOnInit();

              expect(component.isFavourited).toBe(false);
            });

            it('should send unfavourite user event', () => {
              spyOn(publicProfileTrackingEventsService, 'trackFavouriteOrUnfavouriteUserEvent');
              const toggleFavourite = fixture.debugElement.query(By.css(favouriteUserTag));

              toggleFavourite.triggerEventHandler('userFavouriteChanged', false);

              expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteUserEvent).toHaveBeenCalledWith(
                component.userInfo,
                false
              );
            });
          });
        });
      });

      describe('and we NOT get the user...', () => {
        beforeEach(() => {
          resetVariables();
        });

        it('should redirect to the 404 page', () => {
          spyOn(publicProfileService, 'getUser').and.returnValue(throwError(''));
          spyOn(router, 'navigate');

          component.ngOnInit();
          fixture.detectChanges();
          const containerPage = fixture.debugElement.query(By.css(containerSelector));

          expect(containerPage).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith([`/${PUBLIC_PATHS.NOT_FOUND}`]);
        });
      });
    });

    describe('when NOT have the user id..', () => {
      beforeEach(() => {
        route.params = of({});
      });

      it('should NOT show the page', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const containerPage = fixture.debugElement.query(By.css(containerSelector));

        expect(containerPage).toBeFalsy();
        expect(component.userId).toBe(undefined);
      });

      it('should NOT call for more data', () => {
        spyOn(publicProfileService, 'getUser');
        spyOn(publicProfileService, 'getStats');
        spyOn(publicProfileService, 'getShippingCounter');

        component.ngOnInit();
        fixture.detectChanges();

        expect(publicProfileService.getUser).not.toHaveBeenCalled();
        expect(publicProfileService.getStats).not.toHaveBeenCalled();
        expect(publicProfileService.getShippingCounter).not.toHaveBeenCalled();
      });
    });

    describe('when init the component', () => {
      it('should add an ad only on mobile devices', () => {
        spyOn(mockDeviceService, 'isMobile').and.returnValue(true);

        component.ngOnInit();
        fixture.detectChanges();
        const adComponent: DebugElement = fixture.debugElement.query(By.directive(AdComponentStub));

        expect(adComponent).toBeTruthy();
        expect((<AdComponentStub>adComponent.componentInstance).adSlot).toEqual(PUBLIC_PROFILE_AD);
      });

      it('should not an ad when is diferent of mobile devices', () => {
        spyOn(mockDeviceService, 'isMobile').and.returnValue(false);

        component.ngOnInit();
        fixture.detectChanges();
        const adComponent = fixture.debugElement.query(By.directive(AdComponentStub));

        expect(adComponent).toBeFalsy();
      });

      it('should have adSlot public profile', () => {
        expect(component.adSlot).toEqual(PUBLIC_PROFILE_AD);
      });

      it('should set slots on adServices', () => {
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.setSlots).toHaveBeenCalledWith([PUBLIC_PROFILE_AD]);
      });
    });
  });

  function resetVariables(): void {
    component.userId = null;
    component.userStats = null;
    component.userInfo = null;
  }
});
