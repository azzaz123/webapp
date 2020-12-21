import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as CryptoJSAES from 'crypto-js/aes';
import { REDIRECT_SECRET } from '@core/user/logged.guard';

@Injectable({
  providedIn: 'root'
})
export class PublicWebUrlService {
  private REDIRECT_SECRET = REDIRECT_SECRET;

  constructor() {}

  private getEncryptedAndEncodedRedirect(): string {
    const encryptedCurrentUrl = CryptoJSAES.encrypt(
      window.location.href,
      this.REDIRECT_SECRET
    ).toString();
    return encodeURIComponent(encryptedCurrentUrl);
  }

  public getLoginUrl(): string {
    return `${
      environment.siteUrl
    }login?redirectUrl=${this.getEncryptedAndEncodedRedirect()}`;
  }
}
