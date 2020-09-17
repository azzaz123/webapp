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

    const userConsentedGoogle = this.library.getUserConsentStatusForVendor('google');
    const allConsents = this.library.getUserConsentStatusForAll();
    const { purposes } = allConsents;
    const { disabled: userDisabledPurpouses } = purposes;

    const allowingSegmentation = userDisabledPurpouses.length === 0 && userConsentedGoogle;
    return allowingSegmentation;
  }

}
