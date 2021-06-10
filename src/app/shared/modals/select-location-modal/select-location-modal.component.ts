import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-select-location-modal',
  templateUrl: './select-location-modal.component.html',
  styleUrls: ['./select-location-modal.component.scss'],
})
export class LocationSelectorModal implements OnInit {
  public locationForm: FormGroup;
  public isLoading: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorsService
  ) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
    });
  }

  public onSubmit(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const location = this.locationForm.get('location').value;
    const newLocation: Coordinate = {
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.address,
    };
    this.saveLocation(newLocation);
  }

  private saveLocation(newLocation: Coordinate): void {
    this.userService.updateLocation(newLocation).subscribe(
      (newUserLocation) => {
        this.isLoading = false;
        this.userService.user.location = newUserLocation;
        this.userService.updateSearchLocationCookies(newLocation);
        this.activeModal.close(true);
      },
      () => {
        this.isLoading = false;
        this.errorService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      }
    );
  }
}
