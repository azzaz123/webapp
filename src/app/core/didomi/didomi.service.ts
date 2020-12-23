import { WINDOW_TOKEN } from './../window/window.token';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { LoadExternalLibsService } from '../load-external-libs/load-external-libs.service';
import { DIDOMI_EMBED } from './didomi-embed-script';
import { DidomiLibrary } from './didomi.interface';

@Injectable({
  providedIn: 'root',
})
export class DidomiService {
  private static NAME_LIB = 'Didomi';

  private isReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  get library(): DidomiLibrary {
    return this.window['Didomi'];
  }

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private loadExternalLibsService: LoadExternalLibsService
  ) {
    this.addOnReadyListener();
  }

  public userAllowedSegmentationInAds$(): Observable<boolean> {
    return this.loadDidomiLib().pipe(
      switchMap(() => this.isReady$),
      filter((isReady: boolean) => isReady),
      switchMap(() => this.onConsentChanged()),
      startWith(this.userAllowedSegmentationInAds())
    );
  }

  private loadDidomiLib(): Observable<void> {
    return this.loadExternalLibsService.loadScriptByText(
      DidomiService.NAME_LIB,
      DIDOMI_EMBED
    );
  }

  private addOnReadyListener() {
    this.window['didomiOnReady'] = this.window['didomiOnReady'] || [];
    this.window['didomiOnReady'].push(() => {
      this.isReady$.next(true);
    });
  }

  private onConsentChanged(): Observable<boolean> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.library.on('consent.changed', (event: any) => {
        const userAllowed: boolean = this.userAllowedSegmentationInAds();
        subscriber.next(userAllowed);
      });
    });
  }

  private userAllowedSegmentationInAds(): boolean {
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
