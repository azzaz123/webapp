import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProInfoComponent } from './profile-pro-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER, USER_LOCATION_COORDINATES, USER_PRO_INFO_RESPONSE } from '../../../../tests/user.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileFormComponent } from '../../profile-form/profile-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { SwitchComponent } from '../../../shared/switch/switch.component';

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
            return Observable.of(MOCK_USER);
          },
          getProInfo() {
            return Observable.of(USER_PRO_INFO_RESPONSE);
          },
          updateProInfo() {
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
      expect(component.user).toBe(MOCK_USER);
    });

    it('should call userService.getProInfo', () => {
      expect(userService.getProInfo).toHaveBeenCalled();
    });

    it('should set userInfo', () => {
      expect(component['userInfo']).toBe(USER_PRO_INFO_RESPONSE);
    });

    it('should set profile form data', () => {
      expect(component.profileForm.value).toEqual({
        first_name: USER_PRO_INFO_RESPONSE.first_name,
        last_name: USER_PRO_INFO_RESPONSE.last_name,
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

    it('should call updateProInfo when notificationsForm changes', () => {
      spyOn(userService, 'updateProInfo').and.callThrough();
      component.notificationsForm.controls['new_chat_notification'].patchValue(false);

      fixture.detectChanges();

      expect(userService.updateProInfo).toHaveBeenCalledWith(component.notificationsForm.value);
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
        spyOn(errorsService, 'i18nSuccess');
        component.profileForm.patchValue(USER_PRO_INFO_RESPONSE);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);
        component.formComponent.hasNotSavedChanges = true;

        component.onSubmit();
      });

      it('should call edit', () => {
        expect(userService.updateProInfo).toHaveBeenCalledWith({
          first_name: USER_PRO_INFO_RESPONSE.first_name,
          last_name: USER_PRO_INFO_RESPONSE.last_name,
          phone_number: USER_PRO_INFO_RESPONSE.phone_number,
          description: USER_PRO_INFO_RESPONSE.description,
          opening_hours: USER_PRO_INFO_RESPONSE.opening_hours
        });
      });

      it('should call i18nSuccess', () => {
        expect(errorsService.i18nSuccess).toHaveBeenCalledWith('userEdited');
      });

      it('should set hasNotSavedChanges to false', () => {
        expect(component.formComponent.hasNotSavedChanges).toBeFalsy();
      });
    });

    describe('invalid form', () => {

      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        component.onSubmit();
      });

      it('should set dirty invalid field', () => {
        expect(component.profileForm.get('location.address').dirty).toBeTruthy();
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });
  });
});
