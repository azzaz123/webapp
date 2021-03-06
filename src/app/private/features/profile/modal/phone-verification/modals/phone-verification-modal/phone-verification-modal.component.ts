import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { parsePhoneNumber } from 'libphonenumber-js';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { SmsCodeVerificationModalComponent } from '../sms-code-verification-modal/sms-code-verification-modal.component';
import { PHONE_PREFIXES } from '../../constants/phone-prefixies-constants';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { APP_LOCALE } from '@configs/subdomains.config';
import { PhonePrefix } from '../../interfaces/phone-prefix.interface';
import { VerificationsNSecurityStore } from '@private/features/profile/pages/verifications-n-security/services/verifications-n-security-store.service';

@Component({
  selector: 'tsl-phone-verification-modal',
  templateUrl: './phone-verification-modal.component.html',
  styleUrls: ['./phone-verification-modal.component.scss'],
})
export class PhoneVerificationModalComponent implements OnInit {
  public prefixes: IOption[];
  public phoneVerificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService,
    @Inject(LOCALE_ID) private locale: APP_LOCALE
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setPhonePrefixes();
  }

  public onSubmitPhone(): void {
    const { prefix, phone } = this.phoneVerificationForm.getRawValue();
    const phoneNumber = prefix + phone;
    if (this.isCorrectPhone(phoneNumber)) {
      this.userVerificationsService
        .verifyPhone(phoneNumber)
        .pipe(take(1))
        .subscribe(
          () => {
            this.activeModal.close();
            this.showSuccessSMSToast(phoneNumber);
            this.openSmsCodeVerificationModal(phoneNumber);
            this.verificationsNSecurityTrackingEventsService.trackStartPhoneVerificationProcessEvent();
          },
          () => {
            this.toastService.show(DEFAULT_ERROR_TOAST);
          }
        );
    } else {
      this.setPhoneErrorForm();
    }
  }

  private buildForm(): void {
    this.phoneVerificationForm = this.fb.group({
      prefix: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  private isCorrectPhone(phoneNumber: string): boolean {
    try {
      const parsePhone = parsePhoneNumber(phoneNumber);
      return parsePhone.isValid();
    } catch (error) {
      return false;
    }
  }

  private setPhoneErrorForm(): void {
    this.phoneVerificationForm.get('phone').setErrors(null);
    this.phoneVerificationForm.get('phone').setErrors({ invalid: true });
    this.phoneVerificationForm.get('phone').markAsDirty();
    this.phoneVerificationForm.markAsPending();
  }

  private setPhonePrefixes(): void {
    const phonePrefixes = PHONE_PREFIXES[this.locale] || PHONE_PREFIXES.en;

    this.prefixes = phonePrefixes.map((e: PhonePrefix) => {
      return {
        value: e.prefix,
        label: `${e.country} (${e.prefix})`,
      };
    });
  }

  private openSmsCodeVerificationModal(phoneNumber: string): void {
    const modalRef: NgbModalRef = this.modalService.open(SmsCodeVerificationModalComponent, {
      windowClass: 'modal-standard',
    });

    modalRef.componentInstance.phoneNumber = phoneNumber;
  }

  private showSuccessSMSToast(phoneNumber: string): void {
    this.toastService.show({
      title: $localize`:@@phone_verification_all_users_sms_sent_system_modal_title:Many thanks`,
      text: $localize`:@@phone_verification_all_users_sms_sent_system_modal_description:We have sent an SMS to the number ${phoneNumber}:INTERPOLATION: with a verification code. Please enter the code to verify your phone.`,
      type: TOAST_TYPES.SUCCESS,
    });
  }
}
