import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MOCK_PHONE_NUMBER, MOCK_PREFIX_PHONE } from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
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
    spyOn(toastService, 'show');
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

    it('should set the resend button as enabled after 60 seconds', fakeAsync(() => {
      component.ngOnInit();

      tick(60000);

      fixture.detectChanges();
      const resendButton = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__resend-btn')).nativeNode;

      expect(resendButton.disabled).toBe(false);
    }));
  });

  describe('when close button is clicked', () => {
    it('should close the modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.SmsCodeVerificationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });

  describe('when user clicks on verify button', () => {
    beforeEach(() => {});
    describe('and the code is valid', () => {
      beforeEach(() => {
        spyOn(userVerificationsService, 'verifySmsCode').and.callThrough();
        component.onSubmitCode();
      });
      it('should close the modal and show a success toast', () => {
        expect(toastService.show).toHaveBeenCalledWith({
          text: 'Now your phone makes your Wallapop experience even safer.',
          title: 'Phone verified!',
          type: TOAST_TYPES.SUCCESS,
        });
        expect(activeModal.close).toHaveBeenCalled();
      });
    });
    describe('and the code is not valid', () => {
      beforeEach(() => {
        spyOn(userVerificationsService, 'verifySmsCode').and.returnValue(throwError('error'));
        component.onSubmitCode();
      });
      it('should mark as dirty the invalid code form control', () => {
        expect(component.codeVerificationForm.get('code').valid).toBe(false);
        expect(component.codeVerificationForm.get('code').dirty).toBe(true);
      });
    });
  });

  describe('resendSMS', () => {
    describe('when resendSMS is called', () => {
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

          component.resendSMS();
        });

        it('should show a default error toast', () => {
          expect(toastService.show).toHaveBeenCalledWith(DEFAULT_ERROR_TOAST);
        });
      });
    });
  });
});
