import { LoadExternalLibsService } from '../load-external-libs/load-external-libs.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DIDOMI_EMBED } from './didomi-embed-script';
import { DidomiLibrary } from './didomi.interface';

@Injectable({
  providedIn: 'root',
})
export class DidomiService {
  private static NAME_LIB = 'Didomi';

  public isReady = false;
  public isReady$: Subject<boolean> = new Subject<boolean>();
  public library: DidomiLibrary = null;

  constructor(private loadExternalLibsService: LoadExternalLibsService) {
    this.addOnReadyListener();
  }

  public initialize(): void {
    this.loadExternalLibsService.loadScriptByText(
      DidomiService.NAME_LIB,
      DIDOMI_EMBED
    );
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

    const userConsentedGoogle = this.library.getUserConsentStatusForVendor(
      'google'
    );
    const allConsents = this.library.getUserConsentStatusForAll();
    const { purposes } = allConsents;
    const { disabled: userDisabledPurpouses } = purposes;

    const allowingSegmentation =
      userDisabledPurpouses.length === 0 && userConsentedGoogle;
    return allowingSegmentation;
  }
}
