import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { competitorLinks, ProfileInfoComponent } from './profile-info.component';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../core/http/http.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { MockBackend } from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { Observable } from 'rxjs';
import {
  IMAGE,
  MOCK_FULL_USER,
  USER_DATA, USER_EDIT_DATA, USER_LOCATION_COORDINATES,
  USER_PRO_DATA,
  USER_EXTRA_INFO
} from '../../../tests/user.fixtures.spec';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BecomeProModalComponent } from '../become-pro-modal/become-pro-modal.component';
import { StripeService } from '../../core/stripe/stripe.service';

const USER_BIRTH_DATE = '2018-04-12';
const USER_GENDER = 'M';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let userService: UserService;
  let errorsService: ErrorsService;
  let http: HttpService;
  let stripeService: StripeService;
  let mockBackend: MockBackend;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbButtonsModule
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: NgbModal, useValue: {
          open() {
          }
        }
        },
        {
          provide: UserService, useValue: {
          user: MOCK_FULL_USER,
          me() {
            return Observable.of(MOCK_FULL_USER);
          },
          isProUser() {
            return Observable.of({});
          },
          getProInfo() {
            return Observable.of({});
          },
          getUserCover() {
            return Observable.of({});
          },
          updateProInfo() {
            return Observable.of({});
          },
          edit() {
            return Observable.of({});
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
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              componentInstance: componentInstance,
              result: Promise.resolve(true)
            };
          }
        }
        },
        {
          provide: StripeService, useValue: {
          isPaymentMethodStripe() {
            return true
          }
        }
        }
      ],
      declarations: [ProfileInfoComponent, ProfileFormComponent, SwitchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    errorsService = TestBed.get(ErrorsService);
    http = TestBed.get(HttpService);
    stripeService = TestBed.get(StripeService);
    mockBackend = TestBed.get(MockBackend);
    modalService = TestBed.get(NgbModal);
    spyOn(userService, 'me').and.callThrough();
    spyOn(userService, 'isProUser').and.returnValue(Observable.of(true));
    spyOn(userService, 'getUserCover').and.returnValue(Observable.of(IMAGE));
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me and set user', () => {
      expect(userService.me).toHaveBeenCalled();
      expect(component.user).toBe(MOCK_FULL_USER);
    });

    it('should call userService.isProUser and set isPro', () => {
      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isPro).toBe(true);
    });

    it('should call stripeService.isPaymentMethodStripe', () => {
      spyOn(stripeService, 'isPaymentMethodStripe').and.returnValue(true);

      component.ngOnInit();

      expect(stripeService.isPaymentMethodStripe).toHaveBeenCalled();
      expect(component.isStripe).toBe(true);
    });

    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
      expect(component.profileForm.get('extra_info').value).toEqual(USER_EXTRA_INFO);
    });

    it('should set profileForm with basic user data if userInfo throws error', () => {
      spyOn(userService, 'getProInfo').and.returnValue(Observable.throwError(''));

      component.ngOnInit();

      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
    });

    it('should call userService.getUserCover and set cover', () => {
      expect(userService.getUserCover).toHaveBeenCalled();
      expect(component.user.coverImage).toBe(IMAGE);
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

      const BASIC_DATA = {
        first_name: USER_DATA.first_name,
        last_name: USER_DATA.last_name
      };

      const DATA = {
        ...BASIC_DATA,
        ...USER_PRO_DATA,
      };

      beforeEach(() => {
        spyOn(userService, 'edit').and.callThrough();
        spyOn(userService, 'updateProInfo').and.callThrough();
        spyOn(errorsService, 'i18nSuccess');
        component.profileForm.patchValue(DATA);
        component.profileForm.get('location.address').patchValue(USER_LOCATION_COORDINATES.name);
        component.profileForm.get('location.latitude').patchValue(USER_LOCATION_COORDINATES.latitude);
        component.profileForm.get('location.longitude').patchValue(USER_LOCATION_COORDINATES.longitude);
        component.formComponent.hasNotSavedChanges = true;

        component.onSubmit();
      });

      it('should call updateProInfo and edit', () => {
        expect(userService.updateProInfo).toHaveBeenCalledWith(DATA);
        expect(userService.edit).toHaveBeenCalledWith(USER_EDIT_DATA);
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
        component.profileForm.get('first_name').patchValue('');
        component.profileForm.get('last_name').patchValue('');
        component.profileForm.get('phone_number').patchValue('');
        component.profileForm.get('description').patchValue('');
        component.profileForm.get('opening_hours').patchValue('');
        component.profileForm.get('link').patchValue('');

        component.onSubmit();
      });

      it('should set dirty invalid fields', () => {
        expect(component.profileForm.get('location.address').dirty).toBeTruthy();
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
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
        competitorLinks.forEach(competitorLink => {
          component.profileForm.get('link').setValue(competitorLink);
          component.onSubmit();

          expect(userService.updateProInfo).not.toHaveBeenCalled();
        });
      });

      it('should throw error toast when have competitors link', () => {
        spyOn(errorsService, 'i18nError');

        competitorLinks.forEach(competitorLink => {
          component.profileForm.get('link').setValue(competitorLink);
          component.onSubmit();

          expect(errorsService.i18nError).toHaveBeenCalledWith('linkError');
        });
      });
    });

  });

  describe('openBecomeProModal', () => {
    it('should open modal if user is not featured', () => {
      component.isPro = false;
      spyOn(modalService, 'open');

      component.openBecomeProModal();

      expect(modalService.open).toHaveBeenCalledWith(BecomeProModalComponent, {windowClass: 'become-pro'});
    });
  });

});
