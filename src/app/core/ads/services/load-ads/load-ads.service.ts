import { Inject, Injectable } from '@angular/core';
import { ADS_SOURCES, GOOGLE_ADS_SENSE_SHOPPING, GOOGLE_ADS_SENSE_SHOPPING_URL } from '@core/ads/constants';
import { AmazonPublisherService, CriteoService, GooglePublisherTagService } from '@core/ads/vendors';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { interval, Observable, zip } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';
import { DidomiService } from './../../vendors/didomi/didomi.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { TcfService } from '@core/ads/vendors/tcf/tcf.service';
import { TcdData, TCF_API_COMMAND, TCF_API_VERSION, TCF_EVENT_STATUS } from '@core/ads/vendors/tcf/tcf.interface';

@Injectable({
  providedIn: 'root',
})
export class LoadAdsService {
  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private loadExternalLibsService: LoadExternalLibsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private criteoService: CriteoService,
    private amazonPublisherService: AmazonPublisherService,
    private didomiService: DidomiService,
    private tcfService: TcfService
  ) {}

  public loadAds(): Observable<void> {
    return zip(this.loadScriptsBySource(), this.loadDidomiLib()).pipe(
      filter((libs: boolean[]) => libs.every((lib) => lib)),
      tap(() => {
        this.tcfService.tcfApi(TCF_API_COMMAND.ADD_EVENT_LISTENER, TCF_API_VERSION.V2, this.initApstag.bind(this));
      }),
      map(() => null)
    );
  }

  private loadDidomiLib(): Observable<boolean> {
    return this.didomiService.loadDidomiLib().pipe(concatMap(() => this.checkLibIsDefined(() => this.didomiService.isLibraryRefDefined())));
  }

  private loadScriptsBySource(): Observable<boolean> {
    return this.loadExternalLibsService.loadScriptBySource(ADS_SOURCES).pipe(
      concatMap(() => this.checkAllLibsBySource()),
      filter((libs: boolean) => libs)
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

  private initApstag(tcData: TcdData, success: boolean): void {
    if (success) {
      if (tcData.eventStatus === TCF_EVENT_STATUS.USER_ACTION_COMPLETE && tcData.tcString) {
        this.amazonPublisherService.init();

        this.tcfService.tcfApi(TCF_API_COMMAND.REMOVE_EVENT_LISTENER, TCF_API_VERSION.V2, this.initApstag.bind(this));
      }
    }
  }
}
