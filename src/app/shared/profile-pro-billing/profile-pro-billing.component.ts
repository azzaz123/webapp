import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { BillingInfoResponse } from '../../core/payments/payment.interface';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { finalize } from 'rxjs/operators';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';
import { EventService } from 'app/core/event/event.service';
import { validDNI, validNIE, validCIF } from 'spain-id';
import { UuidService } from '../../core/uuid/uuid.service';

export enum BILLING_TYPE {
  NATURAL = 'natural',
  LEGAL = 'legal',
}

@Component({
  selector: 'tsl-profile-pro-billing',
  templateUrl: './profile-pro-billing.component.html',
  styleUrls: ['./profile-pro-billing.component.scss'],
})
export class ProfileProBillingComponent
  implements CanComponentDeactivate, OnDestroy {
  public billingForm: FormGroup;
  public isNewBillingInfoForm = true;
  public loading = true;
  public type: string;
  @ViewChild(ProfileFormComponent, { static: true })
  formComponent: ProfileFormComponent;
  @Output() billingInfoFormChange: EventEmitter<FormGroup> = new EventEmitter();
  @Output() billingInfoFormSaved: EventEmitter<FormGroup> = new EventEmitter();
  @Input() containerType: string;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private uuidService: UuidService,
    private eventService: EventService
  ) {
    this.buildForm();
    this.eventService.subscribe('formSubmited', () => {
      this.onSubmit();
    });
  }

  onChanges() {
    this.billingForm.get('type').valueChanges.subscribe((val) => {
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

  ngOnDestroy() {
    this.eventService.unsubscribeAll('formSubmited');
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
      id: this.uuidService.getUUID(),
    });
  }

  initForm(cache: boolean = true) {
    this.paymentService
      .getBillingInfo(cache)
      .subscribe(
        (billingInfo: BillingInfoResponse) => {
          this.isNewBillingInfoForm = false;
          this.type = billingInfo.type || BILLING_TYPE.NATURAL;
          this.billingForm.patchValue(billingInfo);
          if (this.isSpanishCifOrNifValid(billingInfo.cif)) {
            this.billingForm.controls['cif'].disable();
            this.billingForm.controls['type'].disable();
          }
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
          type: this.type || BILLING_TYPE.NATURAL,
        });
        if (this.type === BILLING_TYPE.NATURAL) {
          this.setNaturalRequiredFields();
        } else {
          this.setLegalRequiredFields();
        }
        this.updateFieldsValidity();
        this.onChanges();
        this.loading = false;
      });
  }

  public onSubmit(e?: Event) {
    if (this.billingForm.valid) {
      this.loading = true;
      if (this.billingForm.get('type').value === BILLING_TYPE.LEGAL) {
        this.billingForm.patchValue({
          name: '',
          surname: '',
        });
      } else {
        this.billingForm.patchValue({
          company_name: '',
        });
      }
      this.paymentService
        .updateBillingInfo(this.billingForm.getRawValue())
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          () => {
            this.errorsService.i18nSuccess('userEdited');
            this.billingInfoFormSaved.emit(this.billingForm);
            this.formComponent.initFormControl();
            this.isNewBillingInfoForm = false;
            this.initForm(false);
          },
          (error: HttpErrorResponse) => {
            this.errorsService.show(error);
          }
        );
    } else {
      this.errorsService.i18nError('formErrors');
      for (const control in this.billingForm.controls) {
        if (
          this.billingForm.controls.hasOwnProperty(control) &&
          !this.billingForm.controls[control].valid
        ) {
          this.billingForm.controls[control].markAsDirty();
        }
      }
    }
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public deleteBillingInfo() {
    this.modalService
      .open(DeleteInfoConfirmationModalComponent)
      .result.then((result: boolean) => {
        if (result) {
          this.paymentService
            .deleteBillingInfo(this.billingForm.value.id)
            .subscribe(
              () => {
                this.errorsService.i18nSuccess('deleteBillingInfoSuccess');
                this.initForm(false);
              },
              () => {
                this.errorsService.i18nError('deleteBillingInfoError');
              }
            );
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
    this.billingForm
      .get('cif')
      .setValidators([Validators.required, this.nifValidator]);
  }

  private setLegalRequiredFields() {
    this.billingForm.get('company_name').setValidators(Validators.required);
    this.billingForm.get('name').setValidators(null);
    this.billingForm.get('surname').setValidators(null);
    this.billingForm
      .get('cif')
      .setValidators([Validators.required, this.cifValidator]);
  }

  private updateFieldsValidity() {
    this.billingForm.get('company_name').updateValueAndValidity();
    this.billingForm.get('name').updateValueAndValidity();
    this.billingForm.get('surname').updateValueAndValidity();
    this.billingForm.get('cif').updateValueAndValidity();
  }

  private isSpanishCifOrNifValid(cif: string) {
    if (!cif) {
      return false;
    }

    cif = cif.toUpperCase().replace(/[_\W\s]+/g, '');

    return validDNI(cif) || validCIF(cif) || validNIE(cif);
  }

  private nifValidator(control: FormControl) {
    const nif = control.value.toUpperCase().replace(/[_\W\s]+/g, '');

    return validDNI(nif) || validNIE(nif) ? null : { cif: true };
  }

  private cifValidator(control: FormControl) {
    const cif = control.value.toUpperCase().replace(/[_\W\s]+/g, '');

    return validCIF(cif) ? null : { cif: true };
  }

  private emailValidator(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return pattern.test(control.value) ? null : { email: true };
  }

  get containerTypeIsModal(): boolean {
    return this.containerType === 'modal';
  }

  private cpValidator(control: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(control)) {
      return null;
    }
    const pattern: RegExp = /^[0-9]*$/;

    return pattern.test(control.value) ? null : { postal_code: true };
  }
}
