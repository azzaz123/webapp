import { Observable, interval, zip } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ADS_SOURCES } from '@core/ads/constants';
import { AdSlot } from '@core/ads/models';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '@core/ads/vendors';
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
      switchMap(() => zip(this.checkLibraryGoogle(), this.checkLibraryAmazon(), this.checkLibraryCriteo())),
      map((libs: boolean[]) => libs.every((lib) => lib))
    );
  }

  public setSlots(slots: AdSlot[]): void {
    this.googlePublisherTagService.init(slots);
  }

  private checkLibraryGoogle(): Observable<boolean> {
    return interval(100).pipe(
      map(() => this.googlePublisherTagService.isLibraryRefDefined()),
      filter((isLoaded: boolean) => isLoaded),
      take(1)
    );
  }
  private checkLibraryAmazon(): Observable<boolean> {
    return interval(100).pipe(
      map(() => this.amazonPublisherService.isLibraryRefDefined()),
      filter((isLoaded: boolean) => isLoaded),
      take(1)
    );
  }

  private checkLibraryCriteo(): Observable<boolean> {
    return interval(100).pipe(
      map(() => this.criteoService.isLibraryRefDefined()),
      filter((isLoaded: boolean) => isLoaded),
      take(1)
    );
  }
}
