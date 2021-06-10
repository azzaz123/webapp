import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '@environments/environment';
import * as CryptoJSHSha256 from 'crypto-js/hmac-sha256';
import * as CryptoJSBase64 from 'crypto-js/enc-base64';

export const SECRET =
  'UTI5dVozSmhkSE1zSUhsdmRTZDJaU0JtYjNWdVpDQnBkQ0VnUVhKbElIbHZkU0J5WldGa2VTQjBieUJxYjJsdUlIVnpQeUJxYjJKelFIZGhiR3hoY0c5d0xtTnZiUT09';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenService {
  private _accessToken: string;

  constructor(private cookieService: CookieService) {}

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
    return CryptoJSBase64.stringify(CryptoJSHSha256(signature, CryptoJSBase64.parse(SECRET)));
  };

  get deviceAccessToken(): string {
    return this.cookieService.get('deviceAccessToken' + environment.cookieSuffix)
      ? this.cookieService.get('deviceAccessToken' + environment.cookieSuffix)
      : '';
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

  private storeAccessTokenLocalhost(accessToken: string): void {
    if (!this.isLocalhostServer()) {
      return;
    }

    const cookieName = this.getCookieName();
    const cookieOptions = { domain: 'localhost' };
    this.cookieService.put(cookieName, accessToken, cookieOptions);
  }

  private deleteAccessTokenLocalhost(): void {
    if (!this.isLocalhostServer()) {
      return;
    }

    const cookieName = this.getCookieName();
    const cookieOptions = { domain: 'localhost' };
    this.cookieService.remove(cookieName, cookieOptions);
    this.cookieService.remove('device' + cookieName.charAt(0).toUpperCase() + cookieName.slice(1), cookieOptions);
  }

  private isLocalhostServer(): boolean {
    return document.location.href.startsWith('http://localhost:4200');
  }
}
