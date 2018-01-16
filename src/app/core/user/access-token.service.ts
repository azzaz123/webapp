import { Injectable } from '@angular/core';
import { IAccessTokenService } from 'shield';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';

@Injectable()
export class AccessTokenService implements IAccessTokenService {

  private _accessToken: string;
  private cookieOptions = { domain: '.wallapop.com' };

  constructor(private cookieService: CookieService) {
  }

  public storeAccessToken(accessToken: string): void {
    const cookieName = this.getCookieName();
    this.cookieService.put(cookieName, accessToken, this.cookieOptions);
    this._accessToken = accessToken;
  }

  public deleteAccessToken() {
    const cookieName = this.getCookieName();
    this.cookieService.remove(cookieName, this.cookieOptions);
    this.cookieService.remove('device' + cookieName.charAt(0).toUpperCase(), this.cookieOptions);
    this.cookieService.remove('subdomain');
    this._accessToken = null;
  }

  get accessToken(): string {
    if (!this._accessToken) {
      const cookieName = this.getCookieName();
      this._accessToken = this.cookieService.get(cookieName);
    }
    return this._accessToken;
  }

  private getCookieName() {
    const cookieName = 'accessToken';
    return environment.production ? cookieName : cookieName + environment.cookieSuffix;
  }

}
