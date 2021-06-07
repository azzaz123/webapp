import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { UserService } from '@core/user/user.service';
import { MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of } from 'rxjs';
import { UnsubscribeModalComponent } from '../../modal/unsubscribe-modal/unsubscribe-modal.component';
import { AccountComponent } from './account.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

const USER_BIRTH_DATE = '2018-04-12';
const USER_GENDER = 'M';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let modalService: NgbModal;
  let userService: UserService;
  let errorsService: ErrorsService;

  const componentInstance: any = {
    init: jasmine.createSpy('init'),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbButtonsModule],
        providers: [
          {
            provide: UserService,
            useValue: {
              user: MOCK_FULL_USER,
              edit() {
                return of({});
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
              i18nSuccess() {},
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  componentInstance: componentInstance,
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
        declarations: [AccountComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    component.formComponent = TestBed.inject(ProfileFormComponent);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
    errorsService = TestBed.inject(ErrorsService);
    modalService = TestBed.inject(NgbModal);
  });

  describe('initForm', () => {
    it('should set profileForm with user data', () => {
      component.initForm();

      expect(component.profileForm.get('birth_date').value).toBe(USER_BIRTH_DATE);
      expect(component.profileForm.get('gender').value).toBe(USER_GENDER);
    });
  });

  describe('onSubmit', () => {
    describe('valid form', () => {
      beforeEach(() => {
        spyOn(userService, 'edit').and.callThrough();
        spyOn(errorsService, 'i18nSuccess');
        component.profileForm.patchValue({
          birth_date: USER_BIRTH_DATE,
          gender: USER_GENDER,
        });

        component.onSubmit();
      });

      it('should call edit', () => {
        expect(userService.edit).toHaveBeenCalledWith({
          birth_date: USER_BIRTH_DATE,
          gender: USER_GENDER,
        });
      });

      it('should call i18nSuccess', () => {
        expect(errorsService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.USER_EDITED);
      });
    });

    describe('invalid form', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
        component.profileForm.get('birth_date').patchValue('');
        component.profileForm.get('gender').patchValue('');

        component.onSubmit();
      });

      it('should set dirty invalid fields', () => {
        expect(component.profileForm.get('birth_date').dirty).toBeTruthy();
        expect(component.profileForm.get('gender').dirty).toBeTruthy();
      });

      it('should call i18nError if form is invalid', () => {
        expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.FORM_FIELD_ERROR);
      });
    });

    describe('validation', () => {
      it('should set birth_date valid if value is valid', () => {
        component.profileForm.get('birth_date').setValue('1987-05-25');

        expect(component.profileForm.get('birth_date').valid).toBe(true);
      });

      it('should set birth_date invalid if value is invalid', () => {
        component.profileForm.get('birth_date').setValue('19870-05-25');

        expect(component.profileForm.get('birth_date').valid).toBe(false);
      });
    });
  });

  describe('openUnsubscribeModal', () => {
    it('should open modal', () => {
      spyOn(modalService, 'open');

      component.openUnsubscribeModal();

      expect(modalService.open).toHaveBeenCalledWith(UnsubscribeModalComponent, { windowClass: 'unsubscribe' });
    });
  });

  describe('canExit', () => {
    it('should call formComponent canExit method', () => {
      spyOn(component.formComponent, 'canExit');

      component.canExit();

      expect(component.formComponent.canExit).toHaveBeenCalled();
    });
  });
});
