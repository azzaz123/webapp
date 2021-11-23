import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';

import { Injectable } from '@angular/core';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';

import { AdKeyWords } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AdsKeywordsService {
  private _adKeywords: AdKeyWords;

  constructor(private cookieService: CookieService, private userService: UserService) {}

  get adKeywords(): AdKeyWords {
    return this._adKeywords;
  }

  public saveCustomKeywords(adKeywords: AdKeyWords): void {
    for (const key in adKeywords) {
      if (adKeywords.hasOwnProperty(key)) {
        this.cookieService.put(key, adKeywords[key]);
      }
    }
  }

  public loadAdKeywords(): void {
    this.loadAdKeywordsFromCookies();
    this.loadAdKeywordsLocation();
    this.loadAdKeywordsFromUser();
  }

  private loadAdKeywordsFromCookies(): void {
    const brand = this.cookieService.get('brand');
    const content = this.cookieService.get('content');
    const category = this.cookieService.get('category');
    const minprice = this.cookieService.get('minprice');
    const maxprice = this.cookieService.get('maxprice');
    const MwebSearchLayout = this.cookieService.get('MwebSearchLayout');

    this._adKeywords = {
      brand,
      content,
      category,
      minprice,
      maxprice,
      MwebSearchLayout,
    };
  }

  private loadAdKeywordsLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this._adKeywords.latitude = position.coords.latitude.toString();
        this._adKeywords.longitude = position.coords.longitude.toString();
      });
    }
  }

  private loadAdKeywordsFromUser(): void {
    if (!this.userService.user?.id) {
      return;
    }

    this._adKeywords.gender = this.userService.user.gender;
    this._adKeywords.userId = this.userService.user.id;
    if (this.userService.user.birthDate) {
      this._adKeywords.age = this.getUserAge(this.userService.user);
    }
    if (!this._adKeywords.latitude && this.userService.user.location) {
      this._adKeywords.latitude = this.userService.user.location.approximated_latitude.toString();
    }
    if (!this._adKeywords.longitude && this.userService.user.location) {
      this._adKeywords.longitude = this.userService.user.location.approximated_longitude.toString();
    }
  }

  private getUserAge(user: User): string {
    return moment().diff(user.birthDate, 'years').toString();
  }
}
