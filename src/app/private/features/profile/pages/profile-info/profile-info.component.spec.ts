import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickEditProField,
  SCREEN_IDS,
  ViewProBenefitsPopup,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import {
  IMAGE,
  MOCK_FULL_USER,
  STORE_LOCATION,
  USER_DATA,
  USER_EDIT_DATA,
  USER_LOCATION_COORDINATES,
  USER_PRO_DATA,
} from '@fixtures/user.fixtures.spec';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of, throwError } from 'rxjs';
import { ANALYTICS_FIELDS, BAD_USERNAME_ERROR_CODE, competitorLinks, ProfileInfoComponent } from './profile-info.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { VisibleDirectiveModule } from '@shared/directives/visible/visible.directive.module';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { ChangeStoreLocationModalComponent } from '../../modal/change-store-location-modal/change-store-location-modal.component';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';

@Component({
  selector: 'tsl-cover-upload',
  template: '',
})
class MockCoverUploadComponent {}

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;
  let router: Router;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let permissionsService: NgxPermissionsService;
  let spyUpdateStoreLocation: jasmine.Spy;
  let spyModalService: jasmine.Spy;

  const locationBoxSelector = 'tsl-location-box';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbButtonsModule, VisibleDirectiveModule, NgxPermissionsModule.forRoot()],
        providers: [
          NgxPermissionsService,
          {
            provide: UserService,
            useValue: {
              user: MOCK_FULL_USER,
              isProUser() {
                return true;
              },
              getProInfo() {
                return of({});
              },
              getUserCover() {
                return of({});
              },
              updateProInfo() {
                return of({});
              },
              edit() {
                return of({});
              },
              updateLocation() {
                return of({});
              },
              updateSearchLocationCookies() {},
              hasStoreLocation() {
                return true;
              },
              updateStoreLocation() {
                return of({});
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
              i18nSuccess() {},
              show() {},
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  componentInstance: {},
                  result: Promise.resolve(),
                };
              },
            },
          },
          {
            provide: ProfileFormComponent,
            useValue: {
              initFormControl() {},
              canExit() {},
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
        declarations: [ProfileInfoComponent, ProfileFormComponent, MockCoverUploadComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
    modalService = TestBed.inject(NgbModal);
    analyticsService = TestBed.inject(AnalyticsService);
    router = TestBed.inject(Router);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    component.formComponent = TestBed.inject(ProfileFormComponent);
    permissionsService = TestBed.inject(NgxPermissionsService);
    spyOn(userService, 'getUserCover').and.returnValue(of(IMAGE));
    fixture.detectChanges();
  });

  describe('initForm', () => {
    it('should call userService.me and set user', () => {
      component.initForm();

      expect(component.user).toBe(MOCK_FULL_USER);
    });

    it('should call userService.isProUser and set isPro', () => {
      spyOn(userService, 'isProUser').and.callThrough();

      component.initForm();

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isPro).toBe(true);
    });

    it('should set profileForm with user data', () => {
      component.initForm();

      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
    });

    it('should set profileForm with basic user data if userInfo throws error', () => {
      spyOn(userService, 'getProInfo').and.returnValue(throwError(''));

      component.initForm();

      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
    });

    it('should call userService.getUserCover and set cover', () => {
      component.initForm();

      expect(userService.getUserCover).toHaveBeenCalled();
      expect(component.user.coverImage).toBe(IMAGE);
    });
  });

  describe('canExit', () => {
    it('should call formComponent canExit method', () => {
      spyOn(component.formComponent, 'canExit');

      component.canExit();

      expect(component.formComponent.canExit).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    describe('when the input data is valid', () => {
      const BASIC_DATA = {
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name,
      };

      const DATA = {
        ...BASIC_DATA,
        ...USER_PRO_DATA,
      };

      beforeEach(() => {
        component.initForm();

        component.profileForm.patchValue(DATA);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude + 1);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude + 1);
      });

      describe('and server validates petition', () => {
        beforeEach(() => {
          spyOn(userService, 'edit').and.callThrough();
          spyOn(userService, 'updateProInfo').and.callThrough();
          spyOn(userService, 'updateLocation').and.callThrough();
          spyOn(userService, 'updateSearchLocationCookies').and.callThrough();
          spyOn(errorsService, 'i18nSuccess');

          component.onSubmit();
        });

        it('should call updateProInfo and edit', () => {
          expect(userService.updateProInfo).toHaveBeenCalledWith(DATA);
          expect(userService.edit).toHaveBeenCalledWith({
            ...USER_EDIT_DATA,
            gender: USER_EDIT_DATA.gender.toUpperCase().substr(0, 1),
          });
        });

        it('should call i18nSuccess', () => {
          expect(errorsService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.USER_EDITED);
        });

        it('should call updateLocation', () => {
          expect(userService.updateLocation).toHaveBeenCalledWith({
            latitude: USER_LOCATION_COORDINATES.latitude + 1,
            longitude: USER_LOCATION_COORDINATES.longitude + 1,
            name: USER_LOCATION_COORDINATES.name,
          });
        });

        it('should set search location cookies', () => {
          expect(userService.updateSearchLocationCookies).toHaveBeenCalledWith({
            latitude: USER_LOCATION_COORDINATES.latitude + 1,
            longitude: USER_LOCATION_COORDINATES.longitude + 1,
            name: USER_LOCATION_COORDINATES.name,
          });
        });
      });

      describe('edit store location', () => {
        beforeEach(() => {
          spyUpdateStoreLocation = spyOn(userService, 'updateStoreLocation').and.callThrough();
          spyModalService = spyOn(modalService, 'open').and.callThrough();
        });
        describe('and data was not edited', () => {
          it('should not call the service', () => {
            component.onSubmit();

            expect(userService.updateStoreLocation).not.toHaveBeenCalled();
          });
        });

        describe('and data was edited', () => {
          it('should call the service', () => {
            component.profileForm.get('storeLocation').patchValue(STORE_LOCATION);

            fixture.detectChanges();
            component.onSubmit();

            expect(userService.updateStoreLocation).toHaveBeenCalledWith(STORE_LOCATION);
            expect(userService.updateStoreLocation).toHaveBeenCalledTimes(1);
          });
          describe('and the store location is far from user location', () => {
            beforeEach(() => {
              spyUpdateStoreLocation.and.returnValue(of({ check_change_location: true }));
            });
            it('should show the modal', () => {
              component.profileForm.get('storeLocation').patchValue(STORE_LOCATION);

              fixture.detectChanges();
              component.onSubmit();

              expect(modalService.open).toHaveBeenCalledWith(ChangeStoreLocationModalComponent, { windowClass: 'change-store-location' });
              expect(modalService.open).toHaveBeenCalledTimes(1);
            });
            describe('and user wants to change location', () => {
              beforeEach(() => {
                spyOn(userService, 'updateLocation').and.callThrough();
                spyModalService.and.returnValue({
                  result: Promise.resolve(),
                });
              });

              it('should save new user location', fakeAsync(() => {
                component.profileForm.get('storeLocation').patchValue(STORE_LOCATION);
                fixture.detectChanges();

                component.onSubmit();
                tick();
                fixture.detectChanges();

                expect(userService.updateLocation).toHaveBeenCalledWith({
                  latitude: STORE_LOCATION.latitude,
                  longitude: STORE_LOCATION.longitude,
                  name: STORE_LOCATION.address,
                });
              }));
            });

            describe('and user doesnt want to change location', () => {
              beforeEach(() => {
                spyOn(userService, 'updateLocation').and.callThrough();
                spyModalService.and.returnValue({
                  result: Promise.reject(),
                });
              });

              it('should not save new user location', fakeAsync(() => {
                component.profileForm.get('storeLocation').patchValue(STORE_LOCATION);
                fixture.detectChanges();

                component.onSubmit();
                tick();
                fixture.detectChanges();

                expect(userService.updateLocation).not.toHaveBeenCalledWith({
                  latitude: STORE_LOCATION.latitude,
                  longitude: STORE_LOCATION.longitude,
                  name: STORE_LOCATION.address,
                });
              }));
            });
          });
        });
        describe('and the store location is not far from user location', () => {
          it('should not show the modal', () => {
            spyUpdateStoreLocation.and.returnValue(of({ check_change_location: false }));
            component.profileForm.get('storeLocation').patchValue(STORE_LOCATION);

            fixture.detectChanges();
            component.onSubmit();

            expect(modalService.open).not.toHaveBeenCalled();
          });
        });
      });

      describe('and when the server errors', () => {
        it('should display error to user as a toast', () => {
          const backendError = {
            error: { code: 101, message: 'General error' },
          };
          spyOn(userService, 'edit').and.returnValue(throwError(backendError));
          spyOn(errorsService, 'show');

          component.onSubmit();

          expect(errorsService.show).toHaveBeenCalledWith(backendError);
        });

        describe('and when the server notifies username is incorrect', () => {
          it('should mark username fields as invalid', () => {
            const backendError = {
              error: {
                code: BAD_USERNAME_ERROR_CODE,
                message: 'Incorrect username',
              },
            };
            spyOn(userService, 'edit').and.returnValue(throwError(backendError));
            spyOn(errorsService, 'show');
            let firstNameFieldElementRef;
            let lastNameFieldElementRef;

            component.onSubmit();
            fixture.detectChanges();
            firstNameFieldElementRef = fixture.debugElement.query(By.css('input[formControlname="first_name"]'));
            lastNameFieldElementRef = fixture.debugElement.query(By.css('input[formControlname="last_name"]'));

            expect(firstNameFieldElementRef.classes['ng-invalid']).toBeDefined();
            expect(lastNameFieldElementRef.classes['ng-invalid']).toBeDefined();
          });
        });
      });
    });

    describe('valid form with same location in form and user', () => {
      const BASIC_DATA = {
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name,
      };

      const DATA = {
        ...BASIC_DATA,
        ...USER_PRO_DATA,
      };

      beforeEach(() => {
        component.initForm();
        spyOn(userService, 'updateLocation').and.callThrough();
        spyOn(userService, 'updateSearchLocationCookies').and.callThrough();
        component.updateLocationWhenSearching = false;
        component.profileForm.patchValue(DATA);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);

        component.user.location.approximated_latitude = USER_LOCATION_COORDINATES.latitude;
        component.user.location.approximated_longitude = USER_LOCATION_COORDINATES.longitude;

        component.onSubmit();
      });

      it('should not call updateLocation', () => {
        expect(userService.updateLocation).toHaveBeenCalledTimes(0);
      });

      it('should not change any cookie value', () => {
        expect(userService.updateSearchLocationCookies).toHaveBeenCalledTimes(0);
      });
    });

    describe('invalid form', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        component.profileForm.get('first_name').patchValue('');
        component.profileForm.get('last_name').patchValue('');
        component.profileForm.get('phone_number').patchValue('');
        component.profileForm.get('description').patchValue('');
        component.profileForm.get('opening_hours').patchValue('');
        component.profileForm.get('link').patchValue('');

        component.onSubmit();
      });

      it('should notify address is not valid', () => {
        expect(component.isIncorrectAddress).toBe(true);
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.FORM_FIELD_ERROR);
      });
    });

    describe('invalid link', () => {
      beforeEach(() => {
        spyOn(userService, 'updateProInfo').and.callThrough();
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);
      });

      it('should not call updateProInfo  when have competitors link', () => {
        competitorLinks.forEach((competitorLink) => {
          component.profileForm.get('link').setValue(competitorLink);
          component.onSubmit();

          expect(userService.updateProInfo).not.toHaveBeenCalled();
        });
      });

      it('should throw error toast when have competitors link', () => {
        spyOn(errorsService, 'i18nError');

        competitorLinks.forEach((competitorLink) => {
          component.profileForm.get('link').setValue(competitorLink);
          component.onSubmit();

          expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.LINK_ERROR);
        });
      });
    });

    describe('invalid phone number', () => {
      beforeEach(() => {
        component.isPro = true;
      });

      it('should not call updateProInfo when phone number is not valid', () => {
        spyOn(userService, 'updateProInfo').and.callThrough();

        component.profileForm.get('phone_number').patchValue('invalid_number123');
        component.onSubmit();

        expect(userService.updateProInfo).not.toHaveBeenCalled();
      });

      it('should throw error toast when phone number is not valid', () => {
        spyOn(errorsService, 'i18nError');

        component.profileForm.get('phone_number').patchValue('invalid_number123');
        component.onSubmit();

        expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.PHONE_NUMBER_ERROR);
      });
    });
  });

  describe('openBecomeProModal', () => {
    describe('when user is not featured', () => {
      beforeEach(() => {
        component.isPro = false;
        spyOn(modalService, 'open').and.callThrough();
        spyOn(analyticsService, 'trackPageView');
        spyOn(analyticsService, 'trackEvent');
      });

      it('should track trackViewProBenefitsPopup', () => {
        component.hasTrialAvailable = true;
        const expectedEvent: AnalyticsPageView<ViewProBenefitsPopup> = {
          name: ANALYTICS_EVENT_NAMES.ViewProBenefitsPopup,
          attributes: {
            freeTrial: true,
            screenId: SCREEN_IDS.ProAdvantagesPopup,
            discount: false,
          },
        };

        component.openBecomeProModal(ANALYTICS_FIELDS.DESCRIPTION);

        expect(analyticsService.trackPageView).toBeCalledTimes(1);
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      });

      it('should track ClickEditProField', () => {
        const expectedField = ANALYTICS_FIELDS.DESCRIPTION;
        const expectedEvent: AnalyticsEvent<ClickEditProField> = {
          name: ANALYTICS_EVENT_NAMES.ClickEditProField,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            field: expectedField,
            screenId: SCREEN_IDS.MyProfile,
          },
        };

        component.openBecomeProModal(expectedField);

        expect(analyticsService.trackEvent).toBeCalledTimes(1);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });

      it('should open modal with trial data available', () => {
        spyOn(subscriptionsService, 'getSubscriptions');
        component.hasTrialAvailable = true;

        component.openBecomeProModal(ANALYTICS_FIELDS.DESCRIPTION);

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(subscriptionsService.getSubscriptions).not.toHaveBeenCalled();
      });

      it('should open modal without trial data available', () => {
        spyOn(subscriptionsService, 'getSubscriptions').and.callThrough();
        component.openBecomeProModal(ANALYTICS_FIELDS.DESCRIPTION);

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(subscriptionsService.getSubscriptions).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user is featured', () => {
      beforeEach(() => {
        component.isPro = true;
        spyOn(modalService, 'open').and.callThrough();
        spyOn(analyticsService, 'trackPageView');
      });

      it('should not track events', () => {
        component.openBecomeProModal(ANALYTICS_FIELDS.DESCRIPTION);

        expect(analyticsService.trackPageView).not.toHaveBeenCalled();
      });

      it('should not open modal', () => {
        component.openBecomeProModal(ANALYTICS_FIELDS.DESCRIPTION);

        expect(modalService.open).not.toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
      });
    });

    describe('when the map is not visible in browser', () => {
      beforeEach(() => {
        IntersectionObserver['callback']([{ isIntersecting: false }], { unobserve: () => {} });
        fixture.detectChanges();
      });

      it('should not load map', () => {
        const mapElement = fixture.debugElement.query(By.css(locationBoxSelector));

        expect(mapElement).toBeFalsy();
      });
    });

    describe('when the map is visible in browser', () => {
      beforeEach(() => {
        IntersectionObserver['callback']([{ isIntersecting: true }], { unobserve: () => {} });
        fixture.detectChanges();
      });

      it('should load map', () => {
        const mapElement = fixture.debugElement.query(By.css(locationBoxSelector));

        expect(mapElement).toBeTruthy();
      });
    });

    describe('subscription permission', () => {
      describe('and has permissions', () => {
        beforeEach(() => {
          permissionsService.addPermission(PERMISSIONS.subscriptions);
          fixture.detectChanges();
        });

        it('should show cover field', () => {
          expect(fixture.debugElement.query(By.directive(MockCoverUploadComponent))).toBeTruthy();
        });

        it('should show first name and last name', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="first_name"]'))).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input[formControlname="last_name"]'))).toBeTruthy();
        });

        it('should show description', () => {
          expect(fixture.debugElement.query(By.css('textarea[formControlname="description"]'))).toBeTruthy();
        });

        it('should show opening hours', () => {
          expect(fixture.debugElement.query(By.css('textarea[formControlname="opening_hours"]'))).toBeTruthy();
        });

        it('should show phone number', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="phone_number"]'))).toBeTruthy();
        });

        it('should show web', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="link"]'))).toBeTruthy();
        });
      });
      describe('and has not permissions', () => {
        beforeEach(() => {
          permissionsService.removePermission(PERMISSIONS.subscriptions);
          fixture.detectChanges();
        });

        it('should not show cover field', () => {
          expect(fixture.debugElement.query(By.directive(MockCoverUploadComponent))).toBeFalsy();
        });

        it('should show first name and last name', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="first_name"]'))).toBeTruthy();
          expect(fixture.debugElement.query(By.css('input[formControlname="last_name"]'))).toBeTruthy();
        });

        it('should not show description', () => {
          expect(fixture.debugElement.query(By.css('textarea[formControlname="description"]'))).toBeFalsy();
        });

        it('should not show opening hours', () => {
          expect(fixture.debugElement.query(By.css('textarea[formControlname="opening_hours"]'))).toBeFalsy();
        });

        it('should not show phone number', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="phone_number"]'))).toBeFalsy();
        });

        it('should not show web', () => {
          expect(fixture.debugElement.query(By.css('input[formControlname="link"]'))).toBeFalsy();
        });
      });
    });
  });
});
