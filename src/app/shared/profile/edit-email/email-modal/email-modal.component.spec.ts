import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailModalComponent } from './email-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { USER_EMAIL } from '../../../../../tests/user.fixtures.spec';

describe('EmailModalComponent', () => {
  let component: EmailModalComponent;
  let fixture: ComponentFixture<EmailModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        providers: [
          {
            provide: UserService,
            useValue: {
              updateEmail() {
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
        declarations: [EmailModalComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    activeModal = TestBed.inject(NgbActiveModal);
  });

  describe('onSubmit', () => {
    describe('valid form', () => {
      beforeEach(() => {
        spyOn(userService, 'updateEmail').and.callThrough();
        spyOn(activeModal, 'close');
        component.emailForm.get('email_address').patchValue(USER_EMAIL);

        component.onSubmit();
      });

      it('should update email', () => {
        expect(userService.updateEmail).toHaveBeenCalledWith(USER_EMAIL);
      });

      it('should close modal', () => {
        expect(activeModal.close).toHaveBeenCalledWith(USER_EMAIL);
      });
    });

    describe('invalid form', () => {
      it('should be invalid if fields are empty', () => {
        component.onSubmit();

        expect(component.emailForm.valid).toBeFalsy();
      });

      it('should be invalid if email is not email', () => {
        component.emailForm.get('email_address').patchValue('hola');

        component.onSubmit();

        expect(component.emailForm.valid).toBeFalsy();
      });

      it('should set dirty invalid fields', () => {
        component.onSubmit();

        expect(component.emailForm.get('email_address').dirty).toBeTruthy();
      });
    });
  });
});
