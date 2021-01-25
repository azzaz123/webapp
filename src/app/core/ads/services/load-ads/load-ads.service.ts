import { Observable, interval, zip } from 'rxjs';
import { concatMap, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ADS_SOURCES, AD_SLOTS } from '@core/ads/constants';
import { AdSlot } from '@core/ads/models';
import {
  AmazonPublisherService,
  CriteoService,
  GooglePublisherTagService,
} from '@core/ads/vendors';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';

@Injectable({
  providedIn: 'root',
})
export class LoadAdsService {
  constructor(
    private loadExternalLibsService: LoadExternalLibsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService
  ) {}

  public loadAds(): Observable<boolean> {
    return this.loadExternalLibsService.loadScriptBySource(ADS_SOURCES).pipe(
      switchMap(() =>
        zip(
          this.checkLibraryAsync(
            this.googlePublisherTagService.isLibraryRefDefined
          ),
          this.checkLibraryAsync(this.criteoService.isLibraryRefDefined),
          this.checkLibraryAsync(
            this.amazonPublisherService.isLibraryRefDefined
          )
        )
      ),
      map((libs: boolean[]) => libs.every((lib) => lib))
    );
  }

  public setSlots(slots: AdSlot[]): void {
    this.googlePublisherTagService.init(slots);
  }

  private checkLibraryAsync(fn: () => boolean): Observable<boolean> {
    return interval(100).pipe(
      map(() => fn()),
      filter((isLoaded: boolean) => isLoaded),
      take(1)
    );
  }
}
