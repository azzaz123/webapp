import { CanActivate, CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../http/access-token.service';
import * as CryptoJSAES from 'crypto-js/aes';
import { PUBLIC_PATHS } from 'app/app-routing-constants';

export const REDIRECT_SECRET = 'redirectSecretBRUH';

@Injectable()
export class LoggedGuard implements CanActivate, CanLoad {
  constructor(
    private accessTokenService: AccessTokenService,
    private router: Router
  ) {}

  private _getEncryptedAndEncodedRedirect(): string {
    const encryptedCurrentUrl = CryptoJSAES.encrypt(
      window.location.href,
      REDIRECT_SECRET
    ).toString();
    const encryptedAndEncoded = encodeURIComponent(encryptedCurrentUrl);
    return encryptedAndEncoded;
  }

  private _loggedGuardLogic(): boolean {
    if (!this.accessTokenService.accessToken) {
      this.router.navigate(['/', PUBLIC_PATHS.LOGIN]);
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
