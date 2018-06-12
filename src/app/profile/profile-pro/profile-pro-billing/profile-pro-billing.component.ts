import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../core/payments/payment.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { UUID } from 'angular2-uuid';
import { BillingInfoResponse } from '../../../core/payments/payment.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';

@Component({
  selector: 'tsl-profile-pro-billing',
  templateUrl: './profile-pro-billing.component.html',
  styleUrls: ['./profile-pro-billing.component.scss']
})
export class ProfileProBillingComponent implements OnInit {

  public billingForm: FormGroup;
  public isNewBillingInfoForm = true;

  constructor(private fb: FormBuilder,
              private paymentService: PaymentService,
              private errorsService: ErrorsService,
              private modalService: NgbModal) {
    this.billingForm = fb.group({
      cif: ['', [Validators.required]],
      city: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      street: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      id: UUID.UUID()
    });
  }

  ngOnInit() {
    this.paymentService.getBillingInfo().subscribe((billingInfo: BillingInfoResponse) => {
      this.isNewBillingInfoForm = false;
      this.billingForm.patchValue(billingInfo);
      for (const control in this.billingForm.controls) {
        if (this.billingForm.controls.hasOwnProperty(control)) {
          this.billingForm.controls[control].markAsDirty();
        }
      }
    });
  }

  public onSubmit() {
    if (this.billingForm.valid) {
      this.paymentService.updateBillingInfo(this.billingForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.isNewBillingInfoForm = false;
      }, (response: any) => {
        this.errorsService.show(response);
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