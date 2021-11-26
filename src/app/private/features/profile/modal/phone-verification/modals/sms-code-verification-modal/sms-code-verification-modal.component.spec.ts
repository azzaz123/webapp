import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MOCK_PHONE_NUMBER, MOCK_PREFIX_PHONE } from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { of, throwError } from 'rxjs';
import { SmsCodeVerificationModalComponent } from './sms-code-verification-modal.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('SmsCodeVerificationModalComponent', () => {
  let component: SmsCodeVerificationModalComponent;
  let fixture: ComponentFixture<SmsCodeVerificationModalComponent>;
  let activeModal: NgbActiveModal;
  let userVerificationsService: UserVerificationsService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [SmsCodeVerificationModalComponent, DropdownComponent, MockSvgIconComponent],
      providers: [
        NgbActiveModal,
        FormBuilder,
        ToastService,
        {
          provide: UserVerificationsService,
          useValue: {
            verifySmsCode() {
              return of({});
            },
            verifyPhone() {
              return of({});
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsCodeVerificationModalComponent);
    userVerificationsService = TestBed.inject(UserVerificationsService);
    activeModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(activeModal, 'close').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();
    spyOn(userVerificationsService, 'verifySmsCode').and.callThrough();
  });

  describe('when modal is loaded', () => {
    it('should show the code input and the buttons', () => {
      const codeInput: HTMLElement = fixture.debugElement.query(By.css('input[formControlname="code"]')).nativeElement;
      const resendButton: HTMLElement = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__resend-btn')).nativeElement;
      const verifyButton: HTMLElement = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__verify-btn')).nativeElement;

      expect(codeInput).toBeTruthy();
      expect(resendButton).toBeTruthy();
      expect(verifyButton).toBeTruthy();
    });

    it('should set the resend button as disabled', () => {
      const resendButton = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__resend-btn')).nativeNode;

      expect(resendButton.disabled).toBe(true);
    });
  });

  describe('when close button is clicked', () => {
    it('should dismiss the modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('resendSMS', () => {
    describe('when resendSMS is called', () => {
      beforeEach(() => {});
      describe('and verifyPhone service return success', () => {
        beforeEach(() => {
          spyOn(userVerificationsService, 'verifyPhone').and.callThrough();
          component.phone = MOCK_PHONE_NUMBER;
          component.prefix = MOCK_PREFIX_PHONE;
          component.resendSMS();
          fixture.detectChanges();
        });

        it('should call the verifyPhone and disabled the reset button', () => {
          const resendButton = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__resend-btn')).nativeNode;

          expect(userVerificationsService.verifyPhone).toHaveBeenCalledTimes(1);
          expect(userVerificationsService.verifyPhone).toHaveBeenCalledWith(component.phone, component.prefix);
          expect(resendButton.disabled).toBe(true);
        });
      });

      describe('and verifyPhone service throws an error', () => {
        beforeEach(() => {
          spyOn(userVerificationsService, 'verifyPhone').and.returnValue(throwError('error'));
          spyOn(toastService, 'show');
          component.resendSMS();
        });

        it('should show a default error toast', () => {
          expect(toastService.show).toHaveBeenCalledWith(DEFAULT_ERROR_TOAST);
        });
      });
    });
  });
});
