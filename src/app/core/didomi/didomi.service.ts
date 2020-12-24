import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadExternalLibsService } from '../load-external-libs/load-external-libs.service';
import { WINDOW_TOKEN } from './../window/window.token';
import { DIDOMI_EMBED } from './didomi-embed-script';
import { DidomiLibrary, DidomiUserConsents } from './didomi.interface';

const EVENTS: string[] = ['consent.changed'];
@Injectable({
  providedIn: 'root',
})
export class DidomiService {
  get allowed$(): Observable<boolean> {
    return this.allowedSubject.asObservable();
  }

  get library(): DidomiLibrary {
    return this.window['Didomi'];
  }

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private loadExternalLibsService: LoadExternalLibsService
  ) {
    this.addOnReadyListener();
  }
  private static NAME_LIB = 'Didomi';

  private allowedSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public userAllowedSegmentationInAds$(): Observable<boolean> {
    this.loadDidomiLib();
    return this.allowedSubject.asObservable();
  }

  private loadDidomiLib(): void {
    this.loadExternalLibsService.loadScriptByText(
      DidomiService.NAME_LIB,
      DIDOMI_EMBED
    );
  }

  private addOnReadyListener(): void {
    this.window['didomiOnReady'] = this.window['didomiOnReady'] || [];
    this.window['didomiOnReady'].push(() => {
      this.allowedSubject.next(this.userAllowedSegmentationInAds());
      this.addEventListen('consent.changed');
    });
  }

  private userAllowedSegmentationInAds(): boolean {
    const userConsentedGoogle: boolean = !!this.library.getUserConsentStatusForVendor(
      'google'
    );
    const allConsents: DidomiUserConsents = this.library.getUserConsentStatusForAll();
    const { purposes } = allConsents;
    const { disabled: userDisabledPurpouses } = purposes;

    const allowingSegmentation: boolean =
      userDisabledPurpouses.length === 0 && userConsentedGoogle;
    return allowingSegmentation;
  }

  private addEventListen(event: string): void {
    this.library.on(event, (e) => {
      const allowed: boolean = this.userAllowedSegmentationInAds();
      this.allowedSubject.next(allowed);
    });
  }
}
