import * as moment from 'moment';
import { Inject, Injectable } from '@angular/core';
import { AdTargetings } from '@core/ads/models/ad-targetings';
import { UserService } from '@core/user/user.service';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { User } from '@core/user/user';
import { AD_TARGETINGS_KEY } from '@core/ads/constants/ad-targetings.enum';

@Injectable({
  providedIn: 'root',
})
export class AdsTargetingsService {
  private _adTargetings: AdTargetings;

  constructor(
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService,
    private userService: UserService
  ) {}

  get adTargetings(): AdTargetings {
    return this._adTargetings;
  }

  public setAdTargeting(key: string, value: string): void {
    this._adTargetings[key] = value;
  }

  public setAdTargetings(): void {
    this.setQueryParamsTargetings();
    this.setUserTargetings();
  }

  private setQueryParamsTargetings(): void {
    const params = this.filterParameterStoreService.getParameters();

    params.forEach((param) => {
      if (Object.values(AD_TARGETINGS_KEY).includes(param.key as string as AD_TARGETINGS_KEY)) {
        const key = Object.keys(AD_TARGETINGS_KEY)[Object.values(AD_TARGETINGS_KEY).indexOf(param.key as string as AD_TARGETINGS_KEY)];

        this.setAdTargeting(key, param.value);
      }
    });
  }

  private setUserTargetings(): void {
    if (!this.userService.user?.id) {
      return;
    }

    this._adTargetings.gender = this.userService.user.gender;
    this._adTargetings.userId = this.userService.user.id;
    if (this.userService.user.birthDate) {
      this._adTargetings.age = this.getUserAge(this.userService.user);
    }
    if (!this._adTargetings.latitude && this.userService.user.location) {
      this._adTargetings.latitude = this.userService.user.location.approximated_latitude.toString();
    }
    if (!this._adTargetings.longitude && this.userService.user.location) {
      this._adTargetings.longitude = this.userService.user.location.approximated_longitude.toString();
    }
  }

  private getUserAge(user: User): string {
    return moment().diff(user.birthDate, 'years').toString();
  }
}
