import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailModalComponent } from './email-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../../../core/user/user.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { USER_EMAIL } from '../../../../../tests/user.fixtures.spec';
import { EmailVerificationComponent } from '@private/features/profile/modal/email-verification/email-verification.component';
import { EmailThanksModalComponent } from '@private/features/profile/modal/email-thanks-modal/email-thanks-modal.component';

describe('EmailModalComponent', () => {
  let component: EmailModalComponent;
  let fixture: ComponentFixture<EmailModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  const componentInstance: any = {};

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
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  componentInstance: componentInstance,
                };
              },
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
    modalService = TestBed.inject(NgbModal);
  });

  describe('onSubmit', () => {
    describe('valid form', () => {
      beforeEach(() => {
        spyOn(userService, 'updateEmail').and.callThrough();
        spyOn(activeModal, 'close');
        spyOn(modalService, 'open').and.callThrough();
        component.emailForm.get('email_address').patchValue(USER_EMAIL);

        component.onSubmit();
      });

      it('should update email', () => {
        expect(userService.updateEmail).toHaveBeenCalledWith(USER_EMAIL);
      });

      it('should open the email thanks modal with the corresponding copies', () => {
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };

        expect(modalService.open).toHaveBeenCalledWith(EmailThanksModalComponent, {
          windowClass: 'modal-standard',
        });
        expect(component['modalRef'].componentInstance.copies.title).toBe('Thank you!');
        expect(component['modalRef'].componentInstance.copies.description).toBe(
          `We have sent a verification email to ${USER_EMAIL}. Access your mailbox and follow the steps to verify your email.`
        );
        expect(component['modalRef'].componentInstance.copies.button).toBe('Understood');
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
