
import { CanActivate, CanLoad } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import * as CryptoJS from 'crypto-js';

export const REDIRECT_SECRET = 'redirectSecretBRUH';

@Injectable()
export class LoggedGuard implements CanActivate, CanLoad {

  constructor(private accessTokenService: AccessTokenService) { }

  private _getEncryptedAndEncodedRedirect(): string {
    const encryptedCurrentUrl = CryptoJS.AES.encrypt(window.location.href, REDIRECT_SECRET).toString();
    const encryptedAndEncoded = encodeURIComponent(encryptedCurrentUrl);
    return encryptedAndEncoded;
  }

  private _loggedGuardLogic(): boolean {
    if (!this.accessTokenService.accessToken) {
      const redirect = `${environment.siteUrl}login?redirectUrl=${this._getEncryptedAndEncodedRedirect()}`;
      window.location.href = redirect;
      return false;
    }
    return true;
  }

  public canActivate() {
    return this._loggedGuardLogic();
  }

  public canLoad() {
    return this._loggedGuardLogic();
  }
}
