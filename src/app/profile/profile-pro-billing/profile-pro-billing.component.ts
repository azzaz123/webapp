import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { BillingInfoResponse } from '../../core/payments/payment.interface';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { finalize } from 'rxjs/operators';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';

export enum BILLING_TYPE {
  NATURAL = '0',
  LEGAL = '1'
}


@Component({
  selector: 'tsl-profile-pro-billing',
  templateUrl: './profile-pro-billing.component.html',
  styleUrls: ['./profile-pro-billing.component.scss']
})
export class ProfileProBillingComponent implements CanComponentDeactivate {

  public billingForm: FormGroup;
  public isNewBillingInfoForm = true;
  public loading = false;
  public registrationType: string;
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  constructor(private fb: FormBuilder,
              private paymentService: PaymentService,
              private errorsService: ErrorsService,
              private modalService: NgbModal) {
    this.billingForm = fb.group({
      registrationType: ['', [Validators.required]],
      cif: ['', [Validators.required]],
      city: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: [''],
      name: ['', [Validators.required]],
      phone: [''],
      postal_code: ['', [Validators.required]],
      street: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      id: UUID.UUID()
    });
  }

  onChanges() {
    this.billingForm.get('registrationType').valueChanges.subscribe(val => {
      this.registrationType = val;
      if (val === BILLING_TYPE.NATURAL) {
        this.billingForm.get('name').setValidators(Validators.required);
        this.billingForm.get('surname').setValidators(Validators.required);
      } else {
        this.billingForm.get('company_name').setValidators(Validators.required);
        this.billingForm.get('name').setValidators(null);
        this.billingForm.get('surname').setValidators(null);
      }
      
    });
  }

  initForm() {
    this.paymentService.getBillingInfo().subscribe((billingInfo: BillingInfoResponse) => {
      this.isNewBillingInfoForm = false;
      this.registrationType = BILLING_TYPE.NATURAL;//billingInfo.type
      this.billingForm.patchValue(billingInfo);
      for (const control in this.billingForm.controls) {
        if (this.billingForm.controls.hasOwnProperty(control)) {
          this.billingForm.controls[control].markAsDirty();
        }
      }
      this.onChanges();
    }, () => {
      this.registrationType = BILLING_TYPE.NATURAL;
      this.onChanges();
    });
  }

  public onSubmit() {
    if (this.billingForm.valid) {
      this.loading = true;
      if (this.billingForm.get('registrationType').value === BILLING_TYPE.LEGAL) {
        this.billingForm.patchValue({
          name: '',
          surname: ''
        });
      } else {
        this.billingForm.patchValue({
          company_name: ''
        });
      }
      this.paymentService.updateBillingInfo(this.billingForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.formComponent.initFormControl();
        this.isNewBillingInfoForm = false;
      }, (error: HttpErrorResponse) => {
        this.errorsService.show(error);
      });
    } else {
      this.errorsService.i18nError('formErrors');
      for (const control in this.billingForm.controls) {
        if (this.billingForm.controls.hasOwnProperty(control) && !this.billingForm.controls[control].valid) {
          this.billingForm.controls[control].markAsDirty();
        }
      }
    }
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public deleteBillingInfo() {
    this.modalService.open(DeleteInfoConfirmationModalComponent).result.then((result: boolean) => {
      if (result) {
        this.paymentService.deleteBillingInfo(this.billingForm.value.id).subscribe(() => {
          this.errorsService.i18nSuccess('deleteBillingInfoSuccess');
          this.billingForm.reset();
          this.isNewBillingInfoForm = true;
        }, () => {
          this.errorsService.i18nError('deleteBillingInfoError');
        });
      }
    });
  }
}
