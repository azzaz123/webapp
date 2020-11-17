import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  competitorLinks,
  ProfileInfoComponent,
  BAD_USERNAME_ERROR_CODE,
} from './profile-info.component';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import {
  IMAGE,
  MOCK_FULL_USER,
  USER_DATA,
  USER_EDIT_DATA,
  USER_LOCATION_COORDINATES,
  USER_PRO_DATA,
} from '../../../tests/user.fixtures.spec';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BecomeProModalComponent } from '../become-pro-modal/become-pro-modal.component';
import { By } from '@angular/platform-browser';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;
  const modalInstance: any = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, NgbButtonsModule],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {},
          },
        },
        {
          provide: UserService,
          useValue: {
            user: MOCK_FULL_USER,
            me() {
              return of(MOCK_FULL_USER);
            },
            isProUser() {
              return of({});
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
                componentInstance: modalInstance,
                result: Promise.resolve(true),
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
      ],
      declarations: [
        ProfileInfoComponent,
        ProfileFormComponent,
        SwitchComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    errorsService = TestBed.inject(ErrorsService);
    modalService = TestBed.inject(NgbModal);
    spyOn(userService, 'me').and.callThrough();
    spyOn(userService, 'isProUser').and.returnValue(of(true));
    spyOn(userService, 'getUserCover').and.returnValue(of(IMAGE));
    component.formComponent = TestBed.inject(ProfileFormComponent);
    fixture.detectChanges();
  });

  describe('initForm', () => {
    it('should call userService.me and set user', () => {
      component.initForm();

      expect(userService.me).toHaveBeenCalled();
      expect(component.user).toBe(MOCK_FULL_USER);
    });

    it('should call userService.isProUser and set isPro', () => {
      component.initForm();

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isPro).toBe(true);
    });

    it('should set profileForm with user data', () => {
      component.initForm();

      expect(component.profileForm.get('first_name').value).toBe(
        USER_DATA.first_name
      );
      expect(component.profileForm.get('last_name').value).toBe(
        USER_DATA.last_name
      );
    });

    it('should set profileForm with basic user data if userInfo throws error', () => {
      spyOn(userService, 'getProInfo').and.returnValue(throwError(''));

      component.initForm();

      expect(component.profileForm.get('first_name').value).toBe(
        USER_DATA.first_name
      );
      expect(component.profileForm.get('last_name').value).toBe(
        USER_DATA.last_name
      );
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
        component.profileForm
          .get('location.address')
          .patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm
          .get('location.latitude')
          .patchValue(USER_LOCATION_COORDINATES.latitude + 1);
        component.profileForm
          .get('location.longitude')
          .patchValue(USER_LOCATION_COORDINATES.longitude + 1);
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
          expect(errorsService.i18nSuccess).toHaveBeenCalledWith('userEdited');
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
            spyOn(userService, 'edit').and.returnValue(
              throwError(backendError)
            );
            spyOn(errorsService, 'show');
            let firstNameFieldElementRef;
            let lastNameFieldElementRef;

            component.onSubmit();
            fixture.detectChanges();
            firstNameFieldElementRef = fixture.debugElement.query(
              By.css('input[formControlname="first_name"]')
            );
            lastNameFieldElementRef = fixture.debugElement.query(
              By.css('input[formControlname="last_name"]')
            );

            expect(
              firstNameFieldElementRef.classes['ng-invalid']
            ).toBeDefined();
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
        component.profileForm
          .get('location.address')
          .patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm
          .get('location.latitude')
          .patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm
          .get('location.longitude')
          .patchValue(USER_LOCATION_COORDINATES.longitude);

        component.user.location.approximated_latitude =
          USER_LOCATION_COORDINATES.latitude;
        component.user.location.approximated_longitude =
          USER_LOCATION_COORDINATES.longitude;

        component.onSubmit();
      });

      it('should not call updateLocation', () => {
        expect(userService.updateLocation).toHaveBeenCalledTimes(0);
      });

      it('should not change any cookie value', () => {
        expect(userService.updateSearchLocationCookies).toHaveBeenCalledTimes(
          0
        );
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

      it('should set incorrect address to true', () => {
        expect(component.isIncorrectAddress).toBeTruthy();
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });

    describe('invalid link', () => {
      beforeEach(() => {
        spyOn(userService, 'updateProInfo').and.callThrough();
        component.profileForm
          .get('location.address')
          .patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm
          .get('location.latitude')
          .patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm
          .get('location.longitude')
          .patchValue(USER_LOCATION_COORDINATES.longitude);
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

          expect(errorsService.i18nError).toHaveBeenCalledWith('linkError');
        });
      });
    });

    describe('invalid phone number', () => {
      beforeEach(() => {
        component.isPro = true;
      });

      it('should not call updateProInfo when phone number is not valid', () => {
        spyOn(userService, 'updateProInfo').and.callThrough();

        component.profileForm
          .get('phone_number')
          .patchValue('invalid_number123');
        component.onSubmit();

        expect(userService.updateProInfo).not.toHaveBeenCalled();
      });

      it('should throw error toast when phone number is not valid', () => {
        spyOn(errorsService, 'i18nError');

        component.profileForm
          .get('phone_number')
          .patchValue('invalid_number123');
        component.onSubmit();

        expect(errorsService.i18nError).toHaveBeenCalledWith(
          'phoneNumberError'
        );
      });
    });
  });

  describe('openBecomeProModal', () => {
    it('should open modal if user is not featured', () => {
      component.isPro = false;
      spyOn(modalService, 'open');

      component.openBecomeProModal();

      expect(modalService.open).toHaveBeenCalledWith(BecomeProModalComponent, {
        windowClass: 'become-pro',
      });
    });
  });
});
