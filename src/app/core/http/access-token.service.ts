import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '@environments/environment';

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

  get accessTokenFromCookies(): string {
    return this.cookieService.get(this.getCookieName());
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
