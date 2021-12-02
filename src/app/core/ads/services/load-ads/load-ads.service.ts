import { Injectable } from '@angular/core';
import { ADS_SOURCES, GOOGLE_ADS_SENSE_SHOPPING, GOOGLE_ADS_SENSE_SHOPPING_URL } from '@core/ads/constants';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '@core/ads/vendors';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { interval, Observable, zip } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';
import { DidomiService } from './../../vendors/didomi/didomi.service';

@Injectable({
  providedIn: 'root',
})
export class LoadAdsService {
  constructor(
    private loadExternalLibsService: LoadExternalLibsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService,
    private didomiService: DidomiService
  ) {}

  public loadAds(): Observable<void> {
    return zip(this.loadScriptsBySource(), this.loadDidomiLib()).pipe(
      filter((libs: boolean[]) => libs.every((lib) => lib)),
      map(() => null)
    );
  }

  private loadDidomiLib(): Observable<boolean> {
    return this.didomiService.loadDidomiLib().pipe(concatMap(() => this.checkLibIsDefined(() => this.didomiService.isLibraryRefDefined())));
  }

  private loadScriptsBySource(): Observable<boolean> {
    return this.loadExternalLibsService.loadScriptBySource(ADS_SOURCES).pipe(
      concatMap(() => this.checkAllLibsBySource()),
      filter((libs: boolean) => libs),
      tap(() => this.amazonPublisherService.init())
    );
  }

  private checkAllLibsBySource(): Observable<boolean> {
    return zip(
      this.checkLibIsDefined(() => this.googlePublisherTagService.isLibraryRefDefined()),
      this.checkLibIsDefined(() => this.amazonPublisherService.isLibraryRefDefined()),
      this.checkLibIsDefined(() => this.criteoService.isLibraryRefDefined())
    ).pipe(map((libs: boolean[]) => libs.every((lib: boolean) => lib)));
  }

  private checkLibIsDefined(fn: () => boolean): Observable<boolean> {
    return interval(100).pipe(
      map(() => fn()),
      filter((defined: boolean) => defined),
      take(1)
    );
  }
}
