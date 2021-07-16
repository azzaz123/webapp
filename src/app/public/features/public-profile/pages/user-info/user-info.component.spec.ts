import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER, MOCK_USER, STORE_LOCATION } from '@fixtures/user.fixtures.spec';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { of } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';

import { UserInfoComponent } from './user-info.component';

describe('UserInfoComponent', () => {
  const mapTag = 'tsl-here-maps';
  const containerClass = '.UserInfo';
  const fakeMapClass = '.UserInfo__fake-map';
  const mediaClass = '.UserInfo__containerMedia__media';

  let component: UserInfoComponent;
  let permissionService: NgxPermissionsService;
  let userService: UserService;
  let publicProfileService: PublicProfileService;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxPermissionsModule.forRoot()],
      declarations: [UserInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        NgxPermissionsService,
        {
          provide: PublicProfileService,
          useValue: {
            get user() {
              return MOCK_USER;
            },
            getExtraInfo() {
              return of(MOCK_USER.extraInfo);
            },
          },
        },
        { provide: UserService, useClass: MockedUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    permissionService = TestBed.inject(NgxPermissionsService);
    userService = TestBed.inject(UserService);
    publicProfileService = TestBed.inject(PublicProfileService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is not defined...', () => {
    it('should NOT show the user info', () => {
      component.user = null;

      fixture.detectChanges();
      const containerDiv = fixture.debugElement.query(By.css(containerClass));

      expect(containerDiv).toBeFalsy();
    });
  });

  describe('when the user is defined...', () => {
    it('should show the user info', () => {
      const containerDiv = fixture.debugElement.query(By.css(containerClass));

      expect(containerDiv).toBeTruthy();
    });

    describe('Location store', () => {
      beforeEach(() => {
        jest.spyOn(publicProfileService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
        spyOn(publicProfileService, 'getExtraInfo').and.returnValue(of(MOCK_FULL_USER.extraInfo));
      });
      describe('when user has subscription permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
        });
        describe('when it has store location', () => {
          beforeEach(() => {
            spyOn(userService, 'hasStoreLocation').and.returnValue(true);
            component.ngOnInit();
          });
          it('should show store coordinates', fakeAsync(() => {
            const expectedCoordinates: Coordinate = {
              latitude: MOCK_FULL_USER.extraInfo.latitude,
              longitude: MOCK_FULL_USER.extraInfo.longitude,
            };
            tick();

            expect(component.storeLocation).toEqual(expectedCoordinates);
          }));
        });
        describe('when it has not store location', () => {
          beforeEach(() => {
            spyOn(userService, 'hasStoreLocation').and.returnValue(false);
            component.ngOnInit();
          });
          it('should not show store coordinates', fakeAsync(() => {
            tick();

            expect(component.storeLocation).toBeFalsy();
          }));
        });
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should not show store coordinates', fakeAsync(() => {
          component.ngOnInit();
          tick();

          expect(component.storeLocation).toBeFalsy();
        }));
      });
    });

    describe('when the user NOT have coordinates', () => {
      it('should NOT show the map', () => {
        component.coordinates = null;

        fixture.detectChanges();
        const mapComponent = fixture.debugElement.query(By.css(mapTag));
        const fakeMapComponent = fixture.debugElement.query(By.css(fakeMapClass));

        expect(mapComponent).toBeFalsy();
        expect(fakeMapComponent).toBeTruthy();
      });
    });

    describe('when the user have coordinates', () => {
      it('should show the map', () => {
        const mapComponent = fixture.debugElement.query(By.css(mapTag)).nativeElement;
        const fakeMapComponent = fixture.debugElement.query(By.css(fakeMapClass));

        expect(mapComponent).toBeTruthy();
        expect(fakeMapComponent).toBeFalsy();
      });
    });

    describe('when the information is verified...', () => {
      beforeEach(() => {
        component.userValidations = {
          email: true,
          facebook: true,
          mobile: true,
        } as any;
      });

      it('should NOT apply the disabled style', () => {
        fixture.detectChanges();
        const mediaDivs = fixture.debugElement.queryAll(By.css(mediaClass));

        expect(mediaDivs.length).toBe(3);
        mediaDivs.forEach((x) => {
          expect(x.nativeElement.classList).not.toContain('disabled');
        });
      });
    });

    describe('when the information is NOT verified...', () => {
      beforeEach(() => {
        component.userValidations = {
          email: false,
          facebook: false,
          mobile: false,
        } as any;
      });

      it('should apply the disabled style', () => {
        fixture.detectChanges();
        const mediaDivs = fixture.debugElement.queryAll(By.css(mediaClass));

        expect(mediaDivs.length).toBe(3);
        mediaDivs.forEach((x) => {
          expect(x.nativeElement.classList).toContain('disabled');
        });
      });
    });
  });
});
