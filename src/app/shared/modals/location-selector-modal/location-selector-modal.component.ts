import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/user/user.service';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-location-selector-modal',
  templateUrl: './location-selector-modal.component.html',
  styleUrls: ['./location-selector-modal.component.scss'],
})
export class LocationSelectorModalComponent implements OnInit {
  public locationForm: FormGroup;
  public isLoading: boolean;
  public isShownMap = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private errorService: ErrorsService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.showMap();
  }

  public onSubmit(): void {
    if (this.isLoading || this.locationForm.invalid) {
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

  private showMap(): void {
    setTimeout(() => {
      // To prevent here map wider than modal width
      this.isShownMap = true;
    });
  }

  private buildForm(): void {
    this.locationForm = this.fb.group({
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
    });
  }

  private saveLocation(newLocation: Coordinate): void {
    this.userService
      .updateLocation(newLocation)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (newUserLocation) => {
          this.userService.user.location = newUserLocation;
          this.userService.updateSearchLocationCookies(newLocation);
          this.activeModal.close(true);
        },
        () => {
          this.errorService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
        }
      );
  }
}
