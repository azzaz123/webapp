import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserService } from '@core/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IMAGE,
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { of } from 'rxjs';
import { APP_PATHS } from 'app/app-routing-constants';
import { of, throwError } from 'rxjs';
import { PublicProfileService } from '../core/services/public-profile.service';
import { PublicProfileComponent } from './public-profile.component';

describe('PublicProfileComponent', () => {
  const containerSelector = '.PublicProfile';
  let component: PublicProfileComponent;
  let fixture: ComponentFixture<PublicProfileComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let publicProfileService: PublicProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PublicPipesModule],
      declarations: [PublicProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
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
          provide: UserService,
          useValue: {
            user: {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
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
          const containerPage = fixture.debugElement.query(
            By.css(containerSelector)
          );

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
          spyOn(publicProfileService, 'getUser').and.returnValue(
            throwError('')
          );
          spyOn(router, 'navigate');

          component.ngOnInit();
          fixture.detectChanges();
          const containerPage = fixture.debugElement.query(
            By.css(containerSelector)
          );

          expect(containerPage).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith([
            `/${APP_PATHS.NOT_FOUND}`,
          ]);
        });
      });
    });

    describe('when NOT have the user id..', () => {
      beforeEach(() => {
        spyOn(route.snapshot.paramMap, 'get').and.returnValue(undefined);
      });

      it('should NOT show the page', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const containerPage = fixture.debugElement.query(
          By.css(containerSelector)
        );

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
  });

  function resetVariables(): void {
    component.userId = null;
    component.userStats = null;
    component.userInfo = null;
  }
});
