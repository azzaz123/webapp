import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
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
  NATURAL = 'natural',
  LEGAL = 'legal'
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
  public type: string;
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;
  @Output() billingInfoFormChange: EventEmitter<FormGroup> = new EventEmitter();
  
  constructor(private fb: FormBuilder,
              private paymentService: PaymentService,
              private errorsService: ErrorsService,
              private modalService: NgbModal) {
    this.buildForm();
  }

  onChanges() {
    this.billingForm.get('type').valueChanges.subscribe(val => {
      this.type = val;
      if (val === BILLING_TYPE.NATURAL) {
        this.setNaturalRequiredFields();
      } else {
        this.setLegalRequiredFields();
      }
      this.updateFieldsValidity();
      this.billingInfoFormChange.emit(this.billingForm);
    });
  }

  buildForm() {
    this.billingForm = this.fb.group({
      type: ['', [Validators.required]],
      cif: ['', [Validators.required]],
      city: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, this.emailValidator]],
      name: ['', [Validators.required]],
      postal_code: ['', [Validators.required, this.cpValidator]],
      street: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      id: UUID.UUID()
    });
  }

  initForm() {
    this.paymentService.getBillingInfo().subscribe(
      (billingInfo: BillingInfoResponse) => {
        this.isNewBillingInfoForm = false;
        this.type = billingInfo.type || BILLING_TYPE.NATURAL;
        this.billingForm.patchValue(billingInfo);
        this.billingForm.controls['cif'].disable();
        this.billingForm.controls['type'].disable();
        this.patchFormValues();
        this.formComponent.initFormControl();
      },
      () => {
        this.type = BILLING_TYPE.NATURAL;
        this.patchFormValues();
        this.formComponent.initFormControl();
        this.isNewBillingInfoForm = true;
        this.billingForm.controls['cif'].enable();
        this.billingForm.controls['type'].enable(); 
        this.buildForm();
      }
    )
    .add(() => {
      this.billingForm.patchValue({
        type: this.type || BILLING_TYPE.NATURAL
      });
      if (this.type === BILLING_TYPE.NATURAL) {
        this.setNaturalRequiredFields();
      } else {
        this.setLegalRequiredFields();
      }
      this.updateFieldsValidity();
      this.onChanges();
    });
  }

  public onSubmit() {
    if (this.billingForm.valid) {
      this.loading = true;
      if (this.billingForm.get('type').value === BILLING_TYPE.LEGAL) {
        this.billingForm.patchValue({
          name: '',
          surname: ''
        });
      } else {
        this.billingForm.patchValue({
          company_name: ''
        });
      }
      this.paymentService.updateBillingInfo(this.billingForm.getRawValue())
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.formComponent.initFormControl();
        this.isNewBillingInfoForm = false;
        this.initForm();
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
          this.initForm();
        }, () => {
          this.errorsService.i18nError('deleteBillingInfoError');
        });
      }
    });
  }

  private patchFormValues() {
    for (const control in this.billingForm.controls) {
      if (this.billingForm.controls.hasOwnProperty(control)) {
        this.billingForm.controls[control].markAsPristine();
      }
    }
  }

  private setNaturalRequiredFields() {
    this.billingForm.get('name').setValidators(Validators.required);
    this.billingForm.get('surname').setValidators(Validators.required);
    this.billingForm.get('company_name').setValidators(null);
    this.billingForm.get('cif').setValidators([Validators.required, this.nifValidator]);
  }

  private setLegalRequiredFields() {
    this.billingForm.get('company_name').setValidators(Validators.required);
    this.billingForm.get('name').setValidators(null);
    this.billingForm.get('surname').setValidators(null);
    this.billingForm.get('cif').setValidators([Validators.required, this.cifValidator]);
  }

  private updateFieldsValidity() {
    this.billingForm.get('company_name').updateValueAndValidity();
    this.billingForm.get('name').updateValueAndValidity();
    this.billingForm.get('surname').updateValueAndValidity();
    this.billingForm.get('cif').updateValueAndValidity();
  }

  private nifValidator(control: FormControl) {
    const DNI_REGEX = /^(\d{8})([A-Z])$/;
    const NIE_REGEX = /^[XYZKL]\d{7}[A-Z]$/;
    const nif = control.value.toUpperCase().replace(/[_\W\s]+/g, '');

    return (DNI_REGEX.test(nif) || NIE_REGEX.test(nif)) ? null : { 'cif': true };
  }
  
  private cifValidator(control: FormControl) {
    const CIF_REGEX = /^(\d{7})([A-Z])$/;
    const CIF2_REGEX = /^([A-Z])(\d{8})$/;
    const cif = control.value.toUpperCase().replace(/[_\W\s]+/g, '');
    
    return (CIF_REGEX.test(cif) || CIF2_REGEX.test(cif)) ? null : { 'cif': true };
  }

  private emailValidator(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return pattern.test(control.value) ? null : { 'email': true };
  }

  private cpValidator(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp = /^[0-9]*$/;
    
    return pattern.test(control.value) ? null : { 'postal_code': true };
  }

}
