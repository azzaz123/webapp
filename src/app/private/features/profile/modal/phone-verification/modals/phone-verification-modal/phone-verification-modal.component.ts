import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { SmsCodeVerificationModalComponent } from '../sms-code-verification-modal/sms-code-verification-modal.component';
import { PhonePrefixOption } from '../../interfaces/phone-prefix-option.interface';
import { PHONE_PREFIXES } from '../../constants/phone-prefixies-constants';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';

@Component({
  selector: 'tsl-phone-verification-modal',
  templateUrl: './phone-verification-modal.component.html',
  styleUrls: ['./phone-verification-modal.component.scss'],
})
export class PhoneVerificationModalComponent implements OnInit {
  public prefixes: PhonePrefixOption[];
  public phoneVerificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setPhonePrefixes();
  }

  public onSubmitPhone(): void {
    const { prefix, phone } = this.phoneVerificationForm.getRawValue();
    if (this.isCorrectPhone(prefix, phone)) {
      this.userVerificationsService
        .verifyPhone(phone, prefix)
        .pipe(take(1))
        .subscribe(
          () => {
            this.activeModal.close();
            const modalRef: NgbModalRef = this.modalService.open(SmsCodeVerificationModalComponent, {
              windowClass: 'modal-standard',
            });

            modalRef.componentInstance.phone = phone;
            modalRef.componentInstance.prefix = prefix;

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

  private isCorrectPhone(prefix: string, phone: string): boolean {
    try {
      const phoneNumber = parsePhoneNumber(prefix + phone);
      return phoneNumber.isValid();
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
    this.prefixes = PHONE_PREFIXES.map((e) => {
      return {
        country_code: <CountryCode>e.country_code,
        value: e.prefix,
        label: `${e.country} (${e.prefix})`,
      };
    });
  }
}
