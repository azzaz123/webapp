import { Injectable } from '@angular/core';
import { IAccessTokenService } from 'shield';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AccessTokenService implements IAccessTokenService {

  private _accessToken: string;

  constructor(private cookieService: CookieService) {
  }

  public storeAccessToken(accessToken: string): void {
    this.cookieService.put('accessToken', accessToken);
    this._accessToken = accessToken;
  }

  public deleteAccessToken() {
    this.cookieService.remove('accessToken');
    this._accessToken = null;
  }

  get accessToken(): string {
    if (!this._accessToken) {
      const accessToken: string = this.cookieService.get('accessToken');
      if (accessToken) {
        this._accessToken = accessToken;
      }
    }
    return this._accessToken;
  }

}
