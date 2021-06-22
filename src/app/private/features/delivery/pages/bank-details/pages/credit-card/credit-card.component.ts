import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { UuidService } from '@core/uuid/uuid.service';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'tsl-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public cardForm: FormGroup;
  public loading = false;
  public isNewForm = true;
  public loadingButton = false;
  public formErrorMessages;

  constructor(private fb: FormBuilder, private uuidService: UuidService, private location: Location) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public initForm(): void {}

  public onSubmit(): void {}

  public goBack(): void {
    this.location.back();
  }

  private buildForm(): void {
    this.cardForm = this.fb.group({
      id: this.uuidService.getUUID(),
      holder_name: ['', Validators.required],
      card_number: ['', [Validators.required]],
      expiration_date: ['', Validators.required],
      cvv: ['', [Validators.required]],
    });
  }
}
