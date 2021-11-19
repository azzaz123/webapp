import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { parsePhoneNumber } from 'libphonenumber-js';
import { DEFAULT_ERROR_TOAST } from '@layout/toast/core/constants/default-toasts';
import { ToastService } from '@layout/toast/core/services/toast.service';

@Component({
  selector: 'tsl-phone-verification-modal',
  templateUrl: './phone-verification-modal.component.html',
  styleUrls: ['./phone-verification-modal.component.scss'],
})
export class PhoneVerificationModalComponent implements OnInit {
  @Input() email: string;
  public prefixes = [
    {
      country: 'España',
      label: '(+34)',
      value: '+34',
    },
  ];
  public phoneVerificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.buildForm();
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
}
