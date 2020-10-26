import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

export const SECRET =
  'UTI5dVozSmhkSE1zSUhsdmRTZDJaU0JtYjNWdVpDQnBkQ0VnUVhKbElIbHZkU0J5WldGa2VTQjBieUJxYjJsdUlIVnpQeUJxYjJKelFIZGhiR3hoY0c5d0xtTnZiUT09';

@Injectable()
export class AccessTokenService {

  private _accessToken: string;

  constructor(private cookieService: CookieService) {
  }

  public storeAccessToken(accessToken: string): void {
    const cookieName = this.getCookieName();
    const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
    this.cookieService.put(cookieName, accessToken, cookieOptions);
    this._accessToken = accessToken;
    this.storeAccessTokenLocalhost(accessToken);
  }

  public deleteAccessToken() {
    const cookieName = this.getCookieName();
    const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
    this.cookieService.remove(cookieName, cookieOptions);
    this.cookieService.remove('device' + cookieName.charAt(0).toUpperCase() + cookieName.slice(1), cookieOptions);
    this.cookieService.remove('subdomain');
    this._accessToken = null;
    this.deleteAccessTokenLocalhost();
  }

  public getTokenSignature = (url: string, method: string, timestamp: number) => {
    const separator = '+#+';
    const signature = ['/' + url.split('?')[0], method, timestamp].join(separator) + separator;
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(signature, CryptoJS.enc.Base64.parse(SECRET)));
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

  private storeAccessTokenLocalhost(accessToken: string) {
    if (!this.isLocalhostServer()) {
      return;
    }

    const cookieName = this.getCookieName();
    const cookieOptions = { domain: 'localhost' };
    this.cookieService.put(cookieName, accessToken, cookieOptions);
  }

  private deleteAccessTokenLocalhost() {
    if (!this.isLocalhostServer()) {
      return;
    }

    const cookieName = this.getCookieName();
    const cookieOptions = { domain: 'localhost' };
    this.cookieService.remove(cookieName, cookieOptions);
    this.cookieService.remove('device' + cookieName.charAt(0).toUpperCase() + cookieName.slice(1), cookieOptions);
  }

  private isLocalhostServer() {
    return document.location.href.startsWith('http://localhost:4200');
  }
}
