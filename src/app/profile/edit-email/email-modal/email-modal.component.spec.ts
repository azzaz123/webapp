import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalComponent } from './email-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_EMAIL } from 'shield';
import { ErrorsService } from '../../../core/errors/errors.service';

describe('EmailModalComponent', () => {
  let component: EmailModalComponent;
  let fixture: ComponentFixture<EmailModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: UserService, useValue: {
          updateEmail() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
          close() {
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          }
        }
        }
      ],
      declarations: [EmailModalComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.get(UserService);
    activeModal = TestBed.get(NgbActiveModal);
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
