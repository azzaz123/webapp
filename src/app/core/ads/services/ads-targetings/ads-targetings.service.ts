import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { AdTargetings } from '@core/ads/models/ad-targetings';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';
import { ActivatedRoute, Params } from '@angular/router';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Injectable({
  providedIn: 'root',
})
export class AdsTargetingsService {
  private _adTargetings: AdTargetings;

  private readonly TARGETINGS_KEY_MAP = {
    [FILTER_QUERY_PARAM_KEY.categoryId]: 'category',
    [FILTER_QUERY_PARAM_KEY.keywords]: 'content',
    [FILTER_QUERY_PARAM_KEY.minPrice]: 'minprice',
    [FILTER_QUERY_PARAM_KEY.maxPrice]: 'maxprice',
    [FILTER_QUERY_PARAM_KEY.brand]: 'brand',
    [FILTER_QUERY_PARAM_KEY.latitude]: 'latitude',
    [FILTER_QUERY_PARAM_KEY.longitude]: 'longitude',
  };

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this._adTargetings = {};
  }

  get adTargetings(): AdTargetings {
    return this._adTargetings;
  }

  public setAdTargeting(adTargetings: AdTargetings): void {
    this._adTargetings = { ...this._adTargetings, ...adTargetings };
  }

  public setAdTargetings(parameters: FilterParameter[]): void {
    this.cleanAdTargetings();
    this.setQueryParamsTargetings(parameters);
    this.setUserTargetings();
  }

  private cleanAdTargetings(): void {
    this._adTargetings = {};
  }

  private setQueryParamsTargetings(filterParams: FilterParameter[]): void {
    const TARGETINGS_KEYS = Object.keys(this.TARGETINGS_KEY_MAP);

    const targetingParams = filterParams.reduce((map, parameter) => {
      const key = parameter.key;
      const value = parameter.value;

      if (TARGETINGS_KEYS.includes(key)) {
        map[this.TARGETINGS_KEY_MAP[key]] = value;
      }

      return map;
    }, {});

    this.setAdTargeting(targetingParams);
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
