import { Component, LOCALE_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MOCK_PHONE_NUMBER, MOCK_PREFIX_PHONE } from '@api/fixtures/user-verifications/phone-verification.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { of } from 'rxjs';
import { SmsCodeVerificationModalComponent } from '../sms-code-verification-modal/sms-code-verification-modal.component';
import { PhoneVerificationModalComponent } from './phone-verification-modal.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('PhoneVerificationModalComponent', () => {
  let component: PhoneVerificationModalComponent;
  let fixture: ComponentFixture<PhoneVerificationModalComponent>;
  let activeModal: NgbActiveModal;
  let userVerificationsService: UserVerificationsService;
  let modalService: NgbModal;
  let verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService;
  let componentInstance: any = {};
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [PhoneVerificationModalComponent, DropdownComponent, MockSvgIconComponent],
      providers: [
        NgbActiveModal,
        FormBuilder,
        ToastService,
        {
          provide: UserVerificationsService,
          useValue: {
            verifyPhone() {
              return of({});
            },
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance,
              };
            },
          },
        },
        {
          provide: VerificationsNSecurityTrackingEventsService,
          useValue: {
            trackStartPhoneVerificationProcessEvent() {},
          },
        },
        {
          provide: LOCALE_ID,
          useValue: 'pr',
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerificationModalComponent);
    userVerificationsService = TestBed.inject(UserVerificationsService);
    modalService = TestBed.inject(NgbModal);
    activeModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    verificationsNSecurityTrackingEventsService = TestBed.inject(VerificationsNSecurityTrackingEventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(activeModal, 'close').and.callThrough();
    spyOn(userVerificationsService, 'verifyPhone').and.callThrough();
    spyOn(toastService, 'show');
  });

  describe('when modal is loaded', () => {
    it('should show prefix field and phone number input', () => {
      const prefixNumber: HTMLElement = fixture.debugElement.query(By.css('tsl-dropdown[formControlname="prefix"]')).nativeElement;
      const phoneNumber: HTMLElement = fixture.debugElement.query(By.css('input[formControlname="phone"]')).nativeElement;

      expect(prefixNumber).toBeTruthy();
      expect(phoneNumber).toBeTruthy();
    });

    it('should show prefix options with correct format', () => {
      const dropdown: DropdownComponent = fixture.debugElement.query(By.directive(DropdownComponent)).componentInstance;
      const option = dropdown.options.find((e: IOption) => {
        return e.value === '+34';
      });

      expect(option).toStrictEqual({ value: '+34', label: 'Spain (+34)' });
    });
  });

  describe('when close button is clicked', () => {
    it('should close the modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.PhoneVerificationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });

  describe('onSubmitPhone', () => {
    describe('when the phone number is valid', () => {
      beforeEach(() => {
        component.phoneVerificationForm.patchValue({ prefix: MOCK_PREFIX_PHONE, phone: MOCK_PHONE_NUMBER });
        spyOn(modalService, 'open').and.callThrough();
        spyOn(verificationsNSecurityTrackingEventsService, 'trackStartPhoneVerificationProcessEvent');
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };
        component.onSubmitPhone();
      });

      it('should call the verifyPhone and close the modal', () => {
        expect(userVerificationsService.verifyPhone).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalled();
      });

      it('should close the modal and open the sms code modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(SmsCodeVerificationModalComponent, {
          windowClass: 'modal-standard',
        });
        expect(component['modalRef'].componentInstance.phoneNumber).toBe(MOCK_PREFIX_PHONE + MOCK_PHONE_NUMBER);
      });

      it('should display the success toast', () => {
        expect(toastService.show).toHaveBeenCalledWith({
          text:
            'We have sent an SMS to the number ' +
            MOCK_PREFIX_PHONE +
            MOCK_PHONE_NUMBER +
            ' with a verification code. Please enter the code to verify your phone.',
          title: 'Many thanks',
          type: TOAST_TYPES.SUCCESS,
        });
      });

      it('should track the start phone verification process', () => {
        expect(verificationsNSecurityTrackingEventsService.trackStartPhoneVerificationProcessEvent).toHaveBeenCalledTimes(1);
        expect(verificationsNSecurityTrackingEventsService.trackStartPhoneVerificationProcessEvent).toHaveBeenCalled();
      });
    });

    describe('when the phone number is not valid', () => {
      beforeEach(() => {
        spyOn(component, 'onSubmitPhone').and.callThrough();
        component.phoneVerificationForm.patchValue({ prefix: '', phone: '' });

        component.onSubmitPhone();
      });

      it('should mark as dirty the invalid phone form control', () => {
        expect(userVerificationsService.verifyPhone).not.toHaveBeenCalled();
        expect(component.phoneVerificationForm.get('phone').valid).toBe(false);
        expect(component.phoneVerificationForm.get('phone').dirty).toBe(true);
      });
    });
  });
});
