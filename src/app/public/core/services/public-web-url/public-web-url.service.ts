import { Inject, Injectable } from '@angular/core';
import * as CryptoJSAES from 'crypto-js/aes';
import { REDIRECT_SECRET } from '@core/user/logged.guard';
import { SITE_URL } from '@configs/site-url.config';

@Injectable({
  providedIn: 'root',
})
export class PublicWebUrlService {
  private REDIRECT_SECRET = REDIRECT_SECRET;

  constructor(@Inject(SITE_URL) private siteUrl: string) {}

  private getEncryptedAndEncodedRedirect(): string {
    const encryptedCurrentUrl = CryptoJSAES.encrypt(window.location.href, this.REDIRECT_SECRET).toString();
    return encodeURIComponent(encryptedCurrentUrl);
  }

  public getLoginUrl(): string {
    return `${this.siteUrl}login?redirectUrl=${this.getEncryptedAndEncodedRedirect()}`;
  }
}
