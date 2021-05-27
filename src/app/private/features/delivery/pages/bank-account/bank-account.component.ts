import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';

@Component({
  selector: 'tsl-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public bankAccountForm: FormGroup;
  public loading = false;
  public formErrorMessages;

  constructor(private fb: FormBuilder, private uuidService: UuidService) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public initForm(): void {}

  public onSubmit(): void {}

  private buildForm(): void {
    this.bankAccountForm = this.fb.group({
      id: this.uuidService.getUUID(),
      iban: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      flat_and_floor: [''],
      postal_code: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }
}
