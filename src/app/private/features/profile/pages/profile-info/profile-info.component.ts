import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { Coordinate, StoreLocation } from '@core/geolocation/address-response.interface';
import { User } from '@core/user/user';
import { UserProInfo } from '@core/user/user-info.interface';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '@core/guards/can-component-deactivate.interface';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { metadata } from 'assets/js/metadata-phonenumber';
import { isValidNumber } from 'libphonenumber-js/custom';
import * as moment from 'moment';
import { finalize, map, mergeMap, take, tap } from 'rxjs/operators';
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
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PERMISSIONS } from '@core/user/user-constants';
import { isEqual } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { ChangeStoreLocationModal } from '../../modal/change-store-location-modal/change-store-location-modal.component';
import { UserLocation } from '@core/user/user-response.interface';
import { Tier } from '@core/subscriptions/subscriptions.interface';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { ProModalConfig } from '@shared/modals/pro-modal/pro-modal.interface';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';

export const competitorLinks = ['coches.net', 'autoscout24.es', 'autocasion.com', 'vibbo.com', 'milanuncios.com', 'motor.es'];

export const BAD_USERNAME_ERROR_CODE = 112;

export enum ANALYTICS_FIELDS {
  HEADER_PHOTO = 'header photo',
  DESCRIPTION = 'description',
  OPENING_HOURS = 'opening hours',
  PHONE = 'phone',
  WEB = 'web',
  SHOP_ADDRESS = 'shop address',
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
  public renderMap = false;
  public readonly PERMISSIONS = PERMISSIONS;
  private tierWithDiscount: Tier;

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
      storeLocation: this.fb.group({
        address: [''],
        latitude: [0],
        longitude: [0],
      }),
    });
  }

  initForm() {
    this.userService
      .getUserCover()
      .pipe(
        finalize(() => {
          this.getProUserData();
        })
      )
      .subscribe((coverImage) => {
        const user = this.userService.user;
        const isPro = this.userService.isProUser();

        this.user = user;
        this.isPro = isPro;
        if (coverImage) {
          this.user.coverImage = coverImage;
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

  private mapUserLocation(userLocation: UserLocation): Partial<UserLocation> {
    return {
      address: userLocation.title,
      latitude: userLocation.approximated_latitude,
      longitude: userLocation.approximated_longitude,
    };
  }

  private setUserData() {
    let userData: any = {
      first_name: this.user.firstName,
      last_name: this.user.lastName,
    };

    if (this.user.location) {
      userData = {
        ...userData,
        location: this.mapUserLocation(this.user.location),
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
      if (this.userService.hasStoreLocation(this.user)) {
        userData = {
          ...userData,
          storeLocation: {
            latitude: this.user.extraInfo.latitude,
            longitude: this.user.extraInfo.longitude,
            address: this.user.extraInfo.address,
          },
        };
      }
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
        this.errorsService.i18nError(TRANSLATION_KEY.PHONE_NUMBER_ERROR);
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
        this.errorsService.i18nError(TRANSLATION_KEY.LINK_ERROR);
        return;
      }
    }

    this.isIncorrectAddress = !this.profileForm.get('location.address').valid;

    if (this.profileForm.valid) {
      const profileFormValue = { ...this.profileForm.value };
      const profileFormLocation = profileFormValue.location;
      const profileFormStoreLocation = profileFormValue.storeLocation;

      delete profileFormValue.location;
      delete profileFormValue.storeLocation;

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
            mergeMap(() => this.checkAndSaveStoreLocation(profileFormStoreLocation)),
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
                this.updateUserLocation(newLocation).subscribe();
              }

              this.errorsService.i18nSuccess(TRANSLATION_KEY.USER_EDITED);
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
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
    }
  }

  private updateUserLocation(newLocation: Coordinate): Observable<UserLocation> {
    return this.userService.updateLocation(newLocation).pipe(
      tap((newUserLocation) => {
        this.userService.user.location = newUserLocation;
        this.profileForm.patchValue({ location: this.mapUserLocation(newUserLocation) });
        this.userService.updateSearchLocationCookies(newLocation);
        this.formComponent.initFormControl();
      })
    );
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

  private checkAndSaveStoreLocation(storeLocationValue: StoreLocation): Observable<boolean> {
    const savedStoreLocation: StoreLocation = {
      latitude: this.user.extraInfo?.latitude || 0,
      longitude: this.user.extraInfo?.longitude || 0,
      address: this.user.extraInfo?.address || '',
    };
    if (isEqual(storeLocationValue, savedStoreLocation)) {
      return of(false);
    }

    return this.userService.updateStoreLocation(storeLocationValue).pipe(
      tap((response) => {
        if (response.check_change_location) {
          this.openChangeStoreLocationModal();
        }
      }),
      map(() => true)
    );
  }

  private openChangeStoreLocationModal(): void {
    const modalRef = this.modalService.open(ChangeStoreLocationModal, {
      windowClass: 'change-store-location',
    });

    modalRef.result.then(
      () => this.changeUserLocationByShopLocation(),
      () => {}
    );
  }

  private changeUserLocationByShopLocation(): void {
    const profileFormValue = { ...this.profileForm.value };
    const profileFormStoreLocation = profileFormValue.storeLocation;
    const newLocation: Coordinate = {
      latitude: profileFormStoreLocation.latitude,
      longitude: profileFormStoreLocation.longitude,
      name: profileFormStoreLocation.address,
    };
    this.loading = true;
    this.updateUserLocation(newLocation)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe();
  }

  public onMapContainerVisible(): void {
    this.renderMap = true;
  }

  private manageModal(): void {
    const modalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    modalRef.componentInstance.modalConfig = this.getProModalConfig();
    this.trackViewProBenefitsPopup();
  }

  private getProModalConfig(): ProModalConfig {
    const config: ProModalConfig = modalConfig[PRO_MODAL_TYPE.profile_pro_fields];

    if (this.hasTrialAvailable) {
      config.title = $localize`:@@web_suggest_pro_modal_description_trial:Try Wallapop PRO for free and explore all their benefits.`;
      config.buttons.primary.text = $localize`:@@web_start_free_trial:Start free trial`;
      return config;
    }

    if (this.tierWithDiscount) {
      config.buttons.primary.text = $localize`:@@pro_after_reactivation_non_subscribed_user_start_with_discount_button:Start with ${this.tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`;
      return config;
    }

    return config;
  }

  private getTrialAvailable(callback?: () => void): void {
    this.subscriptionsService
      .getSubscriptions()
      .pipe(take(1))
      .subscribe((subscriptions) => {
        if (!!subscriptions) {
          this.hasTrialAvailable = this.subscriptionsService.hasOneTrialSubscription(subscriptions);
          this.tierWithDiscount = this.subscriptionsService.getDefaultTierSubscriptionDiscount(subscriptions);
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
        discount: !!this.tierWithDiscount,
      },
    };
    this.analyticsService.trackPageView(event);
  }
}
