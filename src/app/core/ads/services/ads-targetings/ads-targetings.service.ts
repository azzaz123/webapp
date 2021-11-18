import * as moment from 'moment';
import { Inject, Injectable } from '@angular/core';
import { AdTargetings } from '@core/ads/models/ad-targetings';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import { AD_TARGETINGS_KEY } from '@core/ads/constants/ad-targetings.enum';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdsTargetingsService {
  private _adTargetings: AdTargetings;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this._adTargetings = {};
  }

  get adTargetings(): AdTargetings {
    return this._adTargetings;
  }

  // public setAdTargeting(key: string, value: string): void {
  //   this._adTargetings[key] = value;
  // }

  public setAdTargeting(adTargetings: AdTargetings): void {
    for (const key in adTargetings) {
      if (adTargetings.hasOwnProperty(key)) {
        this._adTargetings = { ...this._adTargetings, ...{ key: adTargetings[key] } };
        // this._adTargetings[key] = adTargetings[key]
      }
    }
  }

  public setAdTargetings(): void {
    this.setQueryParamsTargetings();
    this.setUserTargetings();
  }

  public refreshAdTargetings(): void {
    this.resetAdTargetings();
    this.setAdTargetings();
  }

  private resetAdTargetings(): void {
    this._adTargetings = {};
  }

  // private setQueryParamsTargetings(): void {

  //   this.route.queryParams.pipe(
  //     map(params => Object.entries(params).map(([key, value]) => ({key, value})) )
  //   ).subscribe((queryParams) => {
  //     queryParams.forEach((param) => {
  //       if (Object.values(AD_TARGETINGS_KEY).includes(param.key as string as AD_TARGETINGS_KEY)) {
  //         const key = Object.keys(AD_TARGETINGS_KEY)[Object.values(AD_TARGETINGS_KEY).indexOf(param.key as string as AD_TARGETINGS_KEY)];

  //         this.setAdTargeting(key, param.value);
  //       }
  //     });
  //   })
  // }

  private setQueryParamsTargetings(): void {
    this.route.queryParams
      .pipe(map((params) => Object.entries(params).map(([key, value]) => ({ key, value }))))
      .subscribe((queryParams) => {
        queryParams.forEach((param) => {
          if (Object.values(AD_TARGETINGS_KEY).includes(param.key as string as AD_TARGETINGS_KEY)) {
            const key = Object.keys(AD_TARGETINGS_KEY)[Object.values(AD_TARGETINGS_KEY).indexOf(param.key as string as AD_TARGETINGS_KEY)];
            let adTargeting = {};
            adTargeting[key] = param.value;

            this.setAdTargeting(adTargeting);
          }
        });
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
