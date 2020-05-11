import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DIDOMI_EMBED } from './didomi-embed-script';
import { DidomiLibrary } from './didomi.interface';

@Injectable()
export class DidomiService {
  public isReady = false;
  public isReady$: Subject<boolean> = new Subject<boolean>();
  public library: DidomiLibrary = null;

  public initialize(): void {
    this.addOnReadyListener();
    this.appendSDKScriptToDom();
  }

  private appendSDKScriptToDom() {
    const coreScript: HTMLScriptElement = document.createElement('script');
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.setAttribute('charset', 'utf-8');
    coreScript.text = DIDOMI_EMBED;
    document.head.appendChild(coreScript);
  }

  private addOnReadyListener() {
    window['didomiOnReady'] = window['didomiOnReady'] || [];
    window['didomiOnReady'].push(() => {
      this.library = Didomi;
      this.isReady = true;
      this.isReady$.next(true);
    });
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
