import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ToastService } from '@layout/toast/core/services/toast.service';

@Component({
  selector: 'tsl-sms-code-verification-modal',
  templateUrl: './sms-code-verification-modal.component.html',
  styleUrls: ['./sms-code-verification-modal.component.scss'],
})
export class SmsCodeVerificationModalComponent implements OnInit {
  public codeVerificationForm: FormGroup;
  public timer: number = 0;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userVerificationsService: UserVerificationsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public onSubmitCode(): void {
    const { code } = this.codeVerificationForm.getRawValue();

    this.userVerificationsService
      .verifySmsCode(code)
      .pipe(take(1))
      .subscribe(
        () => {
          this.activeModal.close();
        },
        (err) => {
          console.log(err);
          this.setCodeErrorForm();
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
}
