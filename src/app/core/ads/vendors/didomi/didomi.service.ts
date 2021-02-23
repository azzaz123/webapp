import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadExternalLibsService } from '../../../load-external-libs/load-external-libs.service';
import { WINDOW_TOKEN } from '../../../window/window.token';
import { DIDOMI_EMBED } from './didomi-embed-script';
import { DidomiLibrary, DidomiUserConsents } from './didomi.interface';

@Injectable({
  providedIn: 'root',
})
export class DidomiService {
  private static NAME_LIB = 'Didomi';
  private static DIDOMI_ON_READY = 'didomiOnReady';

  private get didomi(): DidomiLibrary {
    return this.window[DidomiService.NAME_LIB];
  }

  private allowedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(WINDOW_TOKEN) private window: Window, private loadExternalLibsService: LoadExternalLibsService) {
    this.addOnReadyListener();
  }

  public loadDidomiLib(): Observable<void> {
    return this.loadExternalLibsService.loadScriptByText(DidomiService.NAME_LIB, DIDOMI_EMBED);
  }

  public isLibraryRefDefined(): boolean {
    return !!this.didomi;
  }

  public allowSegmentation$(): Observable<boolean> {
    return this.allowedSubject.asObservable();
  }

  private addOnReadyListener(): void {
    this.window[DidomiService.DIDOMI_ON_READY] = this.window[DidomiService.DIDOMI_ON_READY] || [];
    this.window[DidomiService.DIDOMI_ON_READY].push(() => {
      const allowed: boolean = this.userAllowedSegmentationInAds();
      this.allowedSubject.next(allowed);
      this.addEventListen('consent.changed');
    });
  }

  private userAllowedSegmentationInAds(): boolean {
    const userConsentedGoogle: boolean = !!this.didomi.getUserConsentStatusForVendor('google');
    const allConsents: DidomiUserConsents = this.didomi.getUserConsentStatusForAll();
    const { purposes } = allConsents;
    const { disabled: userDisabledPurpouses } = purposes;

    const allowingSegmentation: boolean = userDisabledPurpouses.length === 0 && userConsentedGoogle;
    return allowingSegmentation;
  }

  private addEventListen(event: string): void {
    this.didomi.on(event, (e) => {
      const allowed: boolean = this.userAllowedSegmentationInAds();
      this.allowedSubject.next(allowed);
    });
  }
}
