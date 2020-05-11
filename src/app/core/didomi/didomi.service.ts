import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DIDOMI_EMBED } from './didomi-embed-script';

@Injectable()
export class DidomiService {

  public isReady = false;
  public isReady$: Subject<boolean> = new Subject<boolean>();
  public library: any = null;

  public initialize(): void {
    const coreScript: HTMLScriptElement = document.createElement('script');
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.text = DIDOMI_EMBED;
    document.head.appendChild(coreScript);

    this.checkIfReady();
  }

  private checkIfReady(): void {
    const checkInterval = setInterval(() => {
      if (window['Didomi']) {
        this.library = Didomi;
        this.isReady = true;
        this.isReady$.next(this.isReady);
        clearInterval(checkInterval);
      }
    }, 100);
  }

  public userAllowedSegmentationInAds(): boolean {
    if (!this.library) {
      return false;
    }

    const userConsentedCookies = this.library.getUserConsentStatusForPurpose('cookies');
    const userConsentedGoogle = this.library.getUserConsentStatusForVendor('google');
    const userConsentedContentPersonalization = this.library.getUserConsentStatusForPurpose('content_personalization');
    const userConsentedAdsPersonalization = this.library.getUserConsentStatusForPurpose('advertising_personalization');
    const userConsentedAdsDelivery = this.library.getUserConsentStatusForPurpose('ad_delivery');

    const allowingSegmentation =
      !!userConsentedCookies &&
      !!userConsentedGoogle &&
      !!userConsentedContentPersonalization &&
      !!userConsentedAdsPersonalization &&
      !!userConsentedAdsDelivery;

    return allowingSegmentation;
  }

}
