import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordModalComponent } from './password-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';

describe('PasswordModalComponent', () => {
  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;
  let errorsService: ErrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            updatePassword() {
              return of({});
            },
          },
        },
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
          },
        },
      ],
      declarations: [PasswordModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    activeModal = TestBed.inject(NgbActiveModal);
    errorsService = TestBed.inject(ErrorsService);
  });

  describe('onSubmit', () => {
    const OLD_PASSWORD = 'old_password';
    const NEW_PASSWORD = 'password';
    const SHORT_PASSWORD = 'short';

    describe('valid form', () => {
      beforeEach(() => {
        spyOn(userService, 'updatePassword').and.callThrough();
        spyOn(activeModal, 'close');
        component.passwordForm.get('old_password').patchValue(OLD_PASSWORD);
        component.passwordForm.get('new_password').patchValue(NEW_PASSWORD);
        component.passwordForm.get('repeat_password').patchValue(NEW_PASSWORD);

        component.onSubmit();
      });

      it('should update password', () => {
        expect(userService.updatePassword).toHaveBeenCalledWith(
          OLD_PASSWORD,
          NEW_PASSWORD
        );
      });

      it('should close modal', () => {
        expect(activeModal.close).toHaveBeenCalled();
      });
    });

    describe('invalid form', () => {
      beforeEach(() => {
        spyOn(errorsService, 'i18nError');
      });

      it('should be invalid if fields are empty', () => {
        component.onSubmit();

        expect(component.passwordForm.valid).toBeFalsy();
        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });

      it('should be invalid if passwords do not match', () => {
        component.passwordForm.get('old_password').patchValue(OLD_PASSWORD);
        component.passwordForm.get('new_password').patchValue(NEW_PASSWORD);
        component.passwordForm.get('repeat_password').patchValue('test');

        component.onSubmit();

        expect(component.passwordForm.valid).toBeFalsy();
        expect(errorsService.i18nError).toHaveBeenCalledWith('passwordMatch');
      });

      it('should be invalid if new password is too short (< 8 chars)', () => {
        component.passwordForm.get('old_password').patchValue(OLD_PASSWORD);
        component.passwordForm.get('new_password').patchValue(SHORT_PASSWORD);
        component.passwordForm
          .get('repeat_password')
          .patchValue(SHORT_PASSWORD);

        component.onSubmit();

        expect(component.passwordForm.valid).toBeFalsy();
        expect(errorsService.i18nError).toHaveBeenCalledWith(
          'passwordMinLength'
        );
      });

      it('should set dirty invalid fields', () => {
        component.onSubmit();

        expect(component.passwordForm.get('old_password').dirty).toBeTruthy();
        expect(component.passwordForm.get('new_password').dirty).toBeTruthy();
        expect(
          component.passwordForm.get('repeat_password').dirty
        ).toBeTruthy();
      });
    });
  });
});
