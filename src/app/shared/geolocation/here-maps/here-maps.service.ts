/**
 * This service adds necessary elements to <head> to let Here Maps work
 * Also, it does this process in sequence to let the library load correctly
 *
 * "Weird" solution, but allows us to add Here Maps just once and when we need it
 *
 * Info about version: In the high load production environment it is recommended to use the full
 * version of the API in the form 3.1.x.y instead of the evergreen 3.1.
 * That will ensure the continuity and no disruption when the library version is updated on the CDN.
 *
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concat, interval, Observable, of, Subject, throwError } from 'rxjs';
import { finalize, mergeMap, retry, takeUntil } from 'rxjs/operators';

export const HERE_MAPS_VERSION = '3.1.26.0'; // latest
export const HERE_MAPS_CORE_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-core.js`;
export const HERE_MAPS_CORE_LEGACY_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-core-legacy.js`;
export const HERE_MAPS_SERVICE_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-service.js`;
export const HERE_MAPS_SERVICE_LEGACY_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-service-legacy.js`;
export const HERE_MAPS_UI_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-ui.js`;
export const HERE_MAPS_UI_CSS_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-ui.css`;
export const HERE_MAPS_EVENTS_URL = `https://js.api.here.com/v3/${HERE_MAPS_VERSION}/mapsjs-mapevents.js`;

export const HERE_MAPS_CORE_REF_ID = 'src-here-maps-core';
export const HERE_MAPS_CORE_LEGACY_REF_ID = 'src-here-maps-core-legacy';
export const HERE_MAPS_SERVICE_REF_ID = 'src-here-maps-service';
export const HERE_MAPS_SERVICE_LEGACY_REF_ID = 'src-here-maps-service-legacy';
export const HERE_MAPS_UI_REF_ID = 'src-here-maps-ui';
export const HERE_MAPS_UI_CSS_REF_ID = 'src-here-maps-ui-css';
export const HERE_MAPS_EVENTS_REF_ID = 'src-here-maps-events';

export const GEO_APP_ID = 'RgPrXX1bXt123UgUFc7B';
export const GEO_APP_CODE = 'HtfX0DsqZ2Y0x-44GfujFA';
export const GEO_APP_API_KEY = '';

export const CHECK_INTERVAL_MS = 100;
export const RETRY_AMOUNT = 12;

@Injectable({
  providedIn: 'root',
})
export class HereMapsService {
  private isLibraryReadySubject = new BehaviorSubject<boolean>(false);
  private isLibraryLoadingSubject = new BehaviorSubject<boolean>(true);

  public platform: H.service.Platform;
  public isLibraryLoading$ = () => this.isLibraryLoadingSubject.asObservable();

  public initScript(): Observable<boolean> {
    if (!this.isLibraryReadySubject.getValue()) {
      this.loadScript();
    }
    return this.isLibraryReadySubject.asObservable();
  }

  private loadScript(): void {
    this.isLibraryLoadingSubject.next(true);
    concat(
      this.isCoreReady$(),
      combineLatest([
        this.isServiceReady$(),
        // UNCOMMENT WHEN NECESSARY
        // this.isUIReady$(),
        // this.isUICSSReady$(),
        // this.isEventsReady$()
      ])
    )
      .pipe(finalize(() => this.isLibraryLoadingSubject.next(false)))
      .subscribe(
        (next) => next,
        (error) => this.isLibraryReadySubject.next(false),
        () => {
          this.initializePlatform();
          this.isLibraryReadySubject.next(true);
        }
      );
  }

  private initializePlatform(): void {
    this.platform = new H.service.Platform({
      apikey: GEO_APP_API_KEY,
      useCIT: true,
      useHTTPS: true,
    });
  }

  private isCoreReady$(): Observable<boolean> {
    const isReady$ = new Subject<boolean>();
    return interval(CHECK_INTERVAL_MS).pipe(
      mergeMap(() => {
        const coreScriptRef = document.getElementById(HERE_MAPS_CORE_REF_ID);
        const coreScriptLegacyRef = document.getElementById(HERE_MAPS_CORE_LEGACY_REF_ID);
        if (coreScriptRef && coreScriptLegacyRef && window['H']) {
          isReady$.next(true);
          return of(true);
        }
        this.appendCoreToDOM();
        if (!window['H']) {
          return throwError(null);
        }
        return of(false);
      }),
      retry(RETRY_AMOUNT),
      takeUntil(isReady$.asObservable())
    );
  }

  private appendCoreToDOM(): void {
    this.appendScriptToDOM(HERE_MAPS_CORE_REF_ID, HERE_MAPS_CORE_URL);
    this.appendScriptToDOM(HERE_MAPS_CORE_LEGACY_REF_ID, HERE_MAPS_CORE_LEGACY_URL);
  }

  private isServiceReady$(): Observable<boolean> {
    const isReady$ = new Subject<boolean>();
    return interval(CHECK_INTERVAL_MS).pipe(
      mergeMap(() => {
        const serviceScriptRef = document.getElementById(HERE_MAPS_SERVICE_REF_ID);
        const serviceScriptLegacyRef = document.getElementById(HERE_MAPS_SERVICE_LEGACY_REF_ID);
        if (serviceScriptRef && serviceScriptLegacyRef && H.service) {
          isReady$.next(true);
          return of(true);
        }
        this.appendServiceToDOM();
        if (!H.service) {
          return throwError(null);
        }
        return of(false);
      }),
      retry(RETRY_AMOUNT),
      takeUntil(isReady$.asObservable())
    );
  }

  private appendServiceToDOM(): void {
    this.appendScriptToDOM(HERE_MAPS_SERVICE_REF_ID, HERE_MAPS_SERVICE_URL);
    this.appendScriptToDOM(HERE_MAPS_SERVICE_LEGACY_REF_ID, HERE_MAPS_SERVICE_LEGACY_URL);
  }

  private isUIReady$(): Observable<boolean> {
    const isReady$ = new Subject<boolean>();
    return interval(CHECK_INTERVAL_MS).pipe(
      mergeMap(() => {
        const uiScriptRef = document.getElementById(HERE_MAPS_UI_REF_ID);
        if (uiScriptRef && H.ui) {
          isReady$.next(true);
          return of(true);
        }
        this.appendUIToDOM();
        if (!H.ui) {
          return throwError(null);
        }
        return of(false);
      }),
      retry(RETRY_AMOUNT),
      takeUntil(isReady$.asObservable())
    );
  }

  private appendUIToDOM() {
    this.appendScriptToDOM(HERE_MAPS_UI_REF_ID, HERE_MAPS_UI_URL);
  }

  private isUICSSReady$(): Observable<boolean> {
    const isReady$ = new Subject<boolean>();
    return interval(CHECK_INTERVAL_MS).pipe(
      mergeMap(() => {
        const uiCssRef = document.getElementById(HERE_MAPS_UI_CSS_REF_ID);
        if (uiCssRef) {
          isReady$.next(true);
          return of(true);
        }
        this.appendUICSStoDOM();
        if (!uiCssRef) {
          return throwError(null);
        }
        return of(false);
      }),
      retry(RETRY_AMOUNT),
      takeUntil(isReady$.asObservable())
    );
  }

  private appendUICSStoDOM(): void {
    this.appendStyleToDOM(HERE_MAPS_UI_CSS_REF_ID, HERE_MAPS_UI_CSS_URL);
  }

  private isEventsReady$(): Observable<boolean> {
    const isReady$ = new Subject<boolean>();
    return interval(CHECK_INTERVAL_MS).pipe(
      mergeMap(() => {
        const eventsRef = document.getElementById(HERE_MAPS_EVENTS_REF_ID);
        if (eventsRef && H.mapevents) {
          isReady$.next(true);
          return of(true);
        }
        this.appendEventsToDOM();
        if (!H.mapevents) {
          return throwError(null);
        }
        return of(false);
      }),
      retry(RETRY_AMOUNT),
      takeUntil(isReady$.asObservable())
    );
  }

  private appendEventsToDOM(): void {
    this.appendScriptToDOM(HERE_MAPS_EVENTS_REF_ID, HERE_MAPS_EVENTS_URL);
  }

  private appendScriptToDOM(id: string, src: string): void {
    const script = document.createElement('script');
    script.setAttribute('id', id);
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    this.removeFromDOM(id);
    document.head.appendChild(script);
  }

  private appendStyleToDOM(id: string, src: string): void {
    const style = document.createElement('link');
    style.setAttribute('id', id);
    style.setAttribute('href', src);
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    this.removeFromDOM(id);
    document.head.appendChild(style);
  }

  private removeFromDOM(id: string): void {
    const ref = document.getElementById(id);
    if (ref) {
      document.head.removeChild(ref);
    }
  }
}
