import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'tsl-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})
export class BillingInfoComponent {
  public type: string;
  public billingForm: FormGroup;
  @Output() billingInfoFormChange: EventEmitter<FormGroup> = new EventEmitter();

  constructor(private fb: FormBuilder) {
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
      type: ['', [Validators.required]],
      id: UUID.UUID()
    });

    this.onChanges();
  }

  private onChanges() {
    this.billingForm.valueChanges.subscribe(() => {
      this.billingInfoFormChange.emit(this.billingForm);
    });
  }
}
