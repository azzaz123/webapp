import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { SlugsUtilService } from '@core/services/slugs-util/slugs-util.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { AdComponentStub } from '@fixtures/shared';
import { IMAGE, MOCK_FULL_USER_FEATURED, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { APP_PATHS } from 'app/app-routing-constants';
import { of, throwError } from 'rxjs';
import { PUBLIC_PROFILE_AD } from '../core/ads/public-profile-ads.config';
import { PublicProfileService } from '../core/services/public-profile.service';
import { PublicProfileComponent } from './public-profile.component';

describe('PublicProfileComponent', () => {
  const containerSelector = '.PublicProfile';
  let component: PublicProfileComponent;
  let fixture: ComponentFixture<PublicProfileComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let publicProfileService: PublicProfileService;
  let mockDeviceService;

  beforeEach(async () => {
    mockDeviceService = {
      isMobile: () => true,
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PublicProfileComponent, IsCurrentUserStub, AdComponentStub],
      providers: [
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
            getCoverImage() {
              return of(IMAGE);
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
          },
        },
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
    publicProfileService = TestBed.inject(PublicProfileService);
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

          component.ngOnInit();

          expect(publicProfileService.getUser).toHaveBeenCalledTimes(1);
          expect(publicProfileService.getStats).toHaveBeenCalledTimes(1);
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
          expect(router.navigate).toHaveBeenCalledWith([`/${APP_PATHS.NOT_FOUND}`]);
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

        component.ngOnInit();
        fixture.detectChanges();

        expect(publicProfileService.getUser).not.toHaveBeenCalled();
        expect(publicProfileService.getStats).not.toHaveBeenCalled();
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
