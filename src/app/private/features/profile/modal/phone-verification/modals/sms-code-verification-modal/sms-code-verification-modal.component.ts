import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take, takeUntil } from 'rxjs/operators';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { interval, timer } from 'rxjs';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { VerificationsNSecurityStore } from '@private/features/profile/pages/verifications-n-security/services/verifications-n-security-store.service';

@Component({
  selector: 'tsl-sms-code-verification-modal',
  templateUrl: './sms-code-verification-modal.component.html',
  styleUrls: ['./sms-code-verification-modal.component.scss'],
})
export class SmsCodeVerificationModalComponent implements OnInit {
  @Input() phoneNumber: string;

  public codeVerificationForm: FormGroup;
  public timer: number;
  public readonly INTERVAL_RESEND_SMS_SEC = 59;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setTimerToResendSMS();
  }

  public onSubmitCode(): void {
    const { code } = this.codeVerificationForm.getRawValue();

    if (this.isValidCode(code)) {
      this.userVerificationsService
        .verifySmsCode(code)
        .pipe(take(1))
        .subscribe(
          () => {
            this.showSuccessToast();
            this.activeModal.close();
          },
          () => {
            this.setCodeErrorForm();
          }
        );
    } else {
      this.setCodeErrorForm();
    }
  }

  public resendSMS(): void {
    this.userVerificationsService
      .verifyPhone(this.phoneNumber)
      .pipe(take(1))
      .subscribe(
        () => {
          this.setTimerToResendSMS();
          this.showSuccessReSendSMSToast(this.phoneNumber);
        },
        () => {
          this.toastService.show(DEFAULT_ERROR_TOAST);
        }
      );
  }

  private buildForm(): void {
    this.codeVerificationForm = this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  private setCodeErrorForm(): void {
    this.codeVerificationForm.get('code').setErrors(null);
    this.codeVerificationForm.get('code').setErrors({ invalid: true });
    this.codeVerificationForm.get('code').markAsDirty();
    this.codeVerificationForm.markAsPending();
  }

  private setTimerToResendSMS(): void {
    const timeLeft: number = this.INTERVAL_RESEND_SMS_SEC;
    this.timer = timeLeft;

    interval(1000)
      .pipe(takeUntil(timer((this.INTERVAL_RESEND_SMS_SEC + 1) * 1000)))
      .subscribe((sec: number) => {
        this.timer = timeLeft - (sec + 1);
      });
  }

  private showSuccessToast(): void {
    this.toastService.show({
      text: $localize`:@@phone_verification_insert_code_all_users_verification_success_system_modal_description:Now your phone makes your Wallapop experience even safer.`,
      title: $localize`:@@phone_verification_insert_code_all_users_verification_success_system_modal_title:Phone verified!`,
      type: TOAST_TYPES.SUCCESS,
    });
  }

  private isValidCode(code: string): boolean {
    const digitsPattern = /^\d+$/;

    return digitsPattern.test(code);
  }

  private showSuccessReSendSMSToast(phoneNumber: string): void {
    this.toastService.show({
      title: $localize`:@@phone_verification_all_users_sms_sent_system_modal_title:Many thanks`,
      text: $localize`:@@phone_verification_all_users_sms_sent_system_modal_description:We have sent an SMS to the number ${phoneNumber}:INTERPOLATION: with a verification code. Please enter the code to verify your phone.`,
      type: TOAST_TYPES.SUCCESS,
    });
  }
}
