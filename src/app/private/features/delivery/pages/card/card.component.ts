import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';

@Component({
  selector: 'tsl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public cardForm: FormGroup;
  public loading = false;
  public formErrorMessages;

  constructor(private fb: FormBuilder, private uuidService: UuidService) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public initForm(): void {}

  public onSubmit(): void {}

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
