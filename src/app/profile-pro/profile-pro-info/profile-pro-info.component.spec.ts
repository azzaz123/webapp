import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProInfoComponent } from './profile-pro-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../core/user/user.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { MOCK_FULL_USER, USER_LOCATION_COORDINATES, USER_PRO_INFO_RESPONSE } from '../../../tests/user.fixtures.spec';

const USER_BIRTH_DATE = '2018-04-12';

describe('ProfileProInfoComponent', () => {
  let component: ProfileProInfoComponent;
  let fixture: ComponentFixture<ProfileProInfoComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ ProfileProInfoComponent, ProfileFormComponent, SwitchComponent  ],
      providers: [
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_FULL_USER);
          },
          getProInfo() {
            return Observable.of(USER_PRO_INFO_RESPONSE);
          },
          updateProInfo() {
            return Observable.of({});
          },
          updateProInfoNotifications() {
            return Observable.of({});
          },
          edit() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve(true)
            };
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          i18nSuccess() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProInfoComponent);
    component = fixture.componentInstance;
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
    userService = TestBed.get(UserService);
    spyOn(userService, 'me').and.callThrough();
    spyOn(userService, 'getProInfo').and.callThrough();
    fixture.detectChanges();
    errorsService = TestBed.get(ErrorsService);
  });

  describe('ngOninit', () => {
    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });

    it('should set the user', () => {
      expect(component.user).toBe(MOCK_FULL_USER);
    });

    it('should call userService.getProInfo', () => {
      expect(userService.getProInfo).toHaveBeenCalled();
    });

    it('should set userInfo', () => {
      expect(component['userInfo']).toBe(USER_PRO_INFO_RESPONSE);
    });

    it('should set profile form data', () => {
      expect(component.profileForm.value).toEqual({
        first_name: MOCK_FULL_USER.firstName,
        last_name: MOCK_FULL_USER.lastName,
        phone_number: USER_PRO_INFO_RESPONSE.phone_number,
        description: USER_PRO_INFO_RESPONSE.description,
        opening_hours: USER_PRO_INFO_RESPONSE.opening_hours,
        location: {
          address: '',
          latitude: '',
          longitude: ''
        }
      });
    });

    it('should set notifications form data', () => {
      expect(component.notificationsForm.value).toEqual({
        new_chat_notification: true,
        only_chat_phone_notification: true,
        consent_third_parties_use_data: true,
        news_notification: true
      });
    });

  });

  describe('canExit', () => {
    it('should call canExit', () => {
      spyOn(component.formComponent, 'canExit');

      component.canExit();

      expect(component.formComponent.canExit).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {

    describe('valid form', () => {

      beforeEach(() => {
        spyOn(userService, 'updateProInfo').and.callThrough();
        spyOn(userService, 'edit').and.callThrough();
        spyOn(errorsService, 'i18nSuccess');
        component.profileForm.patchValue(USER_PRO_INFO_RESPONSE);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);
        component.formComponent.hasNotSavedChanges = true;

        component.onSubmit();
      });

      it('should call updateProInfo', () => {
        expect(userService.updateProInfo).toHaveBeenCalledWith({
          first_name: MOCK_FULL_USER.firstName,
          last_name: MOCK_FULL_USER.lastName,
          phone_number: USER_PRO_INFO_RESPONSE.phone_number,
          description: USER_PRO_INFO_RESPONSE.description,
          opening_hours: USER_PRO_INFO_RESPONSE.opening_hours
        });
      });

      it('should call edit', () => {
        expect(userService.edit).toHaveBeenCalledWith({
          first_name: MOCK_FULL_USER.firstName,
          last_name: MOCK_FULL_USER.lastName,
          birth_date: USER_BIRTH_DATE,
          gender: MOCK_FULL_USER.gender
        });
      });

      it('should call i18nSuccess', () => {
        expect(errorsService.i18nSuccess).toHaveBeenCalledWith('userEdited');
      });

      it('should set hasNotSavedChanges to false', () => {
        expect(component.formComponent.hasNotSavedChanges).toBe(false);
      });
    });

    describe('invalid form', () => {

      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        component.onSubmit();
      });

      it('should set dirty invalid field', () => {
        expect(component.profileForm.get('location.address').dirty).toBe(true);
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });
  });

  describe('onNotificationChange', () => {
    it('should call updateProInfoNotifications', () => {
      spyOn(userService, 'updateProInfoNotifications').and.callThrough();
      spyOn(errorsService, 'i18nSuccess');

      component.onNotificationChange('new_chat_notification', true);

      expect(userService.updateProInfoNotifications).toHaveBeenCalledWith({
        new_chat_notification: true
      });
      expect(errorsService.i18nSuccess).toHaveBeenCalledWith('settingsEdited');
    });
  });
});
