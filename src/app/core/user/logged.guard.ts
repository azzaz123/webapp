import { CanActivate, CanLoad } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { AccessTokenService } from '../http/access-token.service';
import * as CryptoJSAES from 'crypto-js/aes';
import { SITE_URL } from '@configs/site-url.config';

export const REDIRECT_SECRET = 'redirectSecretBRUH';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate, CanLoad {
  constructor(private accessTokenService: AccessTokenService, @Inject(SITE_URL) private siteUrl: string) {}

  private _getEncryptedAndEncodedRedirect(): string {
    const encryptedCurrentUrl = CryptoJSAES.encrypt(window.location.href, REDIRECT_SECRET).toString();
    const encryptedAndEncoded = encodeURIComponent(encryptedCurrentUrl);
    return encryptedAndEncoded;
  }

  private _loggedGuardLogic(): boolean {
    if (!this.accessTokenService.accessToken) {
      const redirect = `${this.siteUrl}login?redirectUrl=${this._getEncryptedAndEncodedRedirect()}`;
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
