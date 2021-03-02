import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { User } from '@core/user/user';
import { UserProInfo } from '@core/user/user-info.interface';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '@core/guards/can-component-deactivate.interface';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { metadata } from 'assets/js/metadata-phonenumber';
import { isValidNumber } from 'libphonenumber-js/custom';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { BecomeProModalComponent } from '../../modal/become-pro-modal/become-pro-modal.component';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/analytics/analytics.service';
import {
  AnalyticsEvent,
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickEditProField,
  SCREEN_IDS,
  ViewProBenefitsPopup,
} from '@core/analytics/analytics-constants';

export const competitorLinks = ['coches.net', 'autoscout24.es', 'autocasion.com', 'vibbo.com', 'milanuncios.com', 'motor.es'];

export const BAD_USERNAME_ERROR_CODE = 112;

export enum ANALYTICS_FIELDS {
  HEADER_PHOTO = 'header photo',
  DESCRIPTION = 'description',
  OPENING_HOURS = 'opening hours',
  PHONE = 'phone',
  WEB = 'web',
}

@Component({
  selector: 'tsl-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements CanComponentDeactivate {
  public profileForm: FormGroup;
  public allowSegmentation: boolean;
  private userInfo: UserProInfo;
  public user: User;
  public isPro: boolean;
  public updateLocationWhenSearching = false;
  public loading = false;
  public isIncorrectAddress = false;
  public hasTrialAvailable: boolean;
  public ANALYTICS_FIELDS = ANALYTICS_FIELDS;

  @ViewChild(ProfileFormComponent, { static: true })
  formComponent: ProfileFormComponent;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: '',
      phone_number: '',
      description: '',
      opening_hours: '',
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
      link: '',
    });
  }

  initForm() {
    forkJoin([this.userService.me(), this.userService.isProUser(), this.userService.getUserCover()])
      .pipe(
        finalize(() => {
          this.getProUserData();
        })
      )
      .subscribe((values) => {
        this.user = values[0];
        this.isPro = values[1];
        if (values[2]) {
          this.user.coverImage = values[2];
        }
      });
  }

  private getProUserData() {
    this.userService.getProInfo().subscribe(
      (userInfo: UserProInfo) => {
        this.userInfo = userInfo;
        this.setUserData();
      },
      () => {
        this.setUserData();
      }
    );
  }

  private setUserData() {
    let userData: any = {
      first_name: this.user.firstName,
      last_name: this.user.lastName,
    };

    if (this.user.location) {
      userData = {
        ...userData,
        location: {
          address: this.user.location.title,
          latitude: this.user.location.approximated_latitude,
          longitude: this.user.location.approximated_longitude,
        },
      };
    }

    if (this.userInfo && this.isPro) {
      userData = {
        ...userData,
        phone_number: this.userInfo.phone_number,
        description: this.userInfo.description,
        opening_hours: this.userInfo.opening_hours,
        link: this.userInfo.link,
      };
    }

    this.profileForm.patchValue(userData);
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit(): void {
    this.setUsernameFormControlsErrors(false);

    const phoneNumberControl = this.profileForm.get('phone_number');
    if (this.isPro && phoneNumberControl.value) {
      if (!isValidNumber(phoneNumberControl.value, 'ES', metadata)) {
        phoneNumberControl.setErrors({ incorrect: true });
        this.errorsService.i18nError('phoneNumberError');
        return;
      }
    }

    const linkControl = this.profileForm.get('link');
    if (linkControl.value) {
      competitorLinks.forEach((competitor) => {
        let linkSubstring = linkControl.value.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
        let competitorSubstring = competitor.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
        if (linkSubstring === competitorSubstring) {
          linkControl.setErrors({ incorrect: true });
        }
      });
      if (!linkControl.valid) {
        this.errorsService.i18nError('linkError');
        return;
      }
    }

    this.isIncorrectAddress = !this.profileForm.get('location.address').valid;

    if (this.profileForm.valid) {
      const profileFormValue = { ...this.profileForm.value };
      const profileFormLocation = profileFormValue.location;

      delete profileFormValue.location;
      this.loading = true;

      this.userService.updateProInfo(profileFormValue).subscribe(() => {
        this.userService
          .edit({
            first_name: profileFormValue.first_name,
            last_name: profileFormValue.last_name,
            birth_date: this.user.birthDate ? moment(this.user.birthDate).format('YYYY-MM-DD') : null,
            gender: this.user.gender ? this.user.gender.toUpperCase().substr(0, 1) : null,
          })
          .pipe(
            finalize(() => {
              this.loading = false;
              this.formComponent.initFormControl();
            })
          )
          .subscribe(
            () => {
              if (
                !this.user.location ||
                this.user.location.approximated_latitude !== profileFormLocation.latitude ||
                this.user.location.approximated_longitude !== profileFormLocation.longitude
              ) {
                const newLocation: Coordinate = {
                  latitude: profileFormLocation.latitude,
                  longitude: profileFormLocation.longitude,
                  name: profileFormLocation.address,
                };
                this.userService.updateLocation(newLocation).subscribe((newUserLocation) => {
                  this.userService.user.location = newUserLocation;
                  this.userService.updateSearchLocationCookies(newLocation);
                });
              }

              this.errorsService.i18nSuccess('userEdited');
            },
            (errorResponse) => {
              this.errorsService.show(errorResponse);

              const { error } = errorResponse;
              if (!error) {
                return;
              }

              const { code } = error;

              if (code === BAD_USERNAME_ERROR_CODE) {
                this.profileForm.markAsDirty();
                this.setUsernameFormControlsErrors(true);
              }
            }
          );
      });
    } else {
      this.errorsService.i18nError('formErrors');
    }
  }

  public openBecomeProModal(field: ANALYTICS_FIELDS): void {
    if (!this.isPro) {
      this.trackClickEditProField(field);
      if (this.hasTrialAvailable == null) {
        this.getTrialAvailable(() => this.manageModal());
        return;
      }
      this.manageModal();
    }
  }

  private manageModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(BecomeProModalComponent, {
      windowClass: 'become-pro',
    });
    modalRef.componentInstance.hasTrialAvailable = this.hasTrialAvailable;
    modalRef.result.then(
      () => this.router.navigate(['profile/subscriptions']),
      () => null
    );
    this.trackViewProBenefitsPopup();
  }

  private getTrialAvailable(callback?: () => void): void {
    this.subscriptionsService
      .getSubscriptions()
      .pipe(take(1))
      .subscribe((subscriptions) => {
        if (!!subscriptions) {
          this.hasTrialAvailable = this.subscriptionsService.hasOneTrialSubscription(subscriptions);
        }
        if (!!callback) {
          callback();
        }
      });
  }

  private setUsernameFormControlsErrors(incorrect: boolean) {
    const firstNameFormControl = this.profileForm.get('first_name');
    const lastNameFormControl = this.profileForm.get('last_name');

    if (incorrect) {
      firstNameFormControl.setErrors({ incorrect });
      lastNameFormControl.setErrors({ incorrect });
      return;
    }

    firstNameFormControl.setErrors(null);
    lastNameFormControl.setErrors(null);
    firstNameFormControl.updateValueAndValidity();
    lastNameFormControl.updateValueAndValidity();
  }

  private trackClickEditProField(field: ANALYTICS_FIELDS): void {
    const event: AnalyticsEvent<ClickEditProField> = {
      name: ANALYTICS_EVENT_NAMES.ClickEditProField,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        field,
        screenId: SCREEN_IDS.MyProfile,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  private trackViewProBenefitsPopup(): void {
    const event: AnalyticsPageView<ViewProBenefitsPopup> = {
      name: ANALYTICS_EVENT_NAMES.ViewProBenefitsPopup,
      attributes: {
        freeTrial: this.hasTrialAvailable,
        screenId: SCREEN_IDS.ProAdvantagesPopup,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
