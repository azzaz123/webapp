import { Inject, Injectable } from '@angular/core';
import { AdKeyWords, AdShoppingPageOptions, AdSlotShoppingBaseConfiguration } from '@core/ads/models';
import { AdSlotConfiguration } from '@core/ads/models/ad-slot-configuration';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { DeviceService } from '@core/device/device.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { GooglePublisherTagService } from '../../vendors';
import { LoadAdsService } from '../load-ads/load-ads.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private readonly setSlotsSubject: BehaviorSubject<AdSlotConfiguration[]> = new BehaviorSubject<AdSlotConfiguration[]>([]);
  private readonly _adsReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isSegmentationAllowed;

  public get adsReady$(): Observable<boolean> {
    return this._adsReady$.asObservable();
  }

  constructor(
    private didomiService: DidomiService,
    private loadAdsService: LoadAdsService,
    private googlePublisherTagService: GooglePublisherTagService,
    private deviceService: DeviceService,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
    this.listenerToSetSlots();
    this.listenerToDisplaySlots();
  }

  public init(): void {
    if (!this._adsReady$.getValue()) {
      this.loadAdsService
        .loadAds()
        .pipe(
          take(1),
          // TODO: Decide what we should do when Ads scripts are blocked (usually by Adblockers)
          catchError(() => of({}))
        )
        .subscribe(() => {
          this._adsReady$.next(true);
        });
    }
  }

  public setSlots(adSlots: AdSlotConfiguration[]): void {
    this.setSlotsSubject.next(adSlots);
  }

  public destroySlots(adSlots: AdSlotConfiguration[]): void {
    this.googlePublisherTagService.destroySlots(adSlots);
  }

  public refreshSlots(adSlots: AdSlotConfiguration[]): void {
    this.googlePublisherTagService.refreshSlots(adSlots);
  }

  public refreshAllSlots(): void {
    this.googlePublisherTagService.refreshAllSlots();
    this.refreshHeaderBids(this.isSegmentationAllowed);
  }

  public clearSlots(adSlots: AdSlotConfiguration[]): void {
    this.googlePublisherTagService.clearSlots(adSlots);
  }

  public setAdKeywords(adKeywords: AdKeyWords): void {
    this.googlePublisherTagService.setAdKeywords(adKeywords);
  }

  public adSlotLoaded$(adSlot: AdSlotConfiguration): Observable<boolean> {
    return this.googlePublisherTagService.isAdSlotLoaded$(adSlot);
  }

  public displayAdShopping(adShoppingPageOptions: AdShoppingPageOptions, adSlotShopping: AdSlotShoppingBaseConfiguration[]): void {
    this.adsReady$
      .pipe(
        filter((adsReady: boolean) => adsReady),
        tap(() => this.googlePublisherTagService.displayShopping(adShoppingPageOptions, adSlotShopping)),
        take(1)
      )
      .subscribe();
  }

  private get adSlotsDefined$(): Observable<boolean> {
    return this.googlePublisherTagService.isAdSlotsDefined$;
  }

  private get allowSegmentation$(): Observable<boolean> {
    return this.didomiService.allowSegmentation$();
  }

  private get fetchHeaderBids(): Function {
    return this.window['fetchHeaderBids'];
  }

  private listenerToSetSlots(): void {
    combineLatest([this.adsReady$, this.setSlotsSubject.asObservable()])
      .pipe(
        filter(([adsReady, adSlots]: [boolean, AdSlotConfiguration[]]) => adsReady && adSlots.length > 0),
        map(([_, adSlots]: [boolean, AdSlotConfiguration[]]) => adSlots),
        tap((adSlots: AdSlotConfiguration[]) => this.googlePublisherTagService.setSlots(adSlots))
      )
      .subscribe();
  }

  private listenerToDisplaySlots(): void {
    combineLatest([this.adsReady$, this.adSlotsDefined$, this.allowSegmentation$])
      .pipe(
        filter(([adsReady, adSlotsDefined]: [boolean, boolean, boolean]) => adsReady && adSlotsDefined),
        map(([adsReady, adSlotsDefined, allowSegmentation]: [boolean, boolean, boolean]) => allowSegmentation)
      )
      .subscribe((allowSegmentation: boolean) => {
        this.isSegmentationAllowed = allowSegmentation;
        this.getHeaderBids(allowSegmentation);
      });
  }

  private getHeaderBids(allowSegmentation: boolean): void {
    const slots = this.setSlotsSubject.getValue();
    const definedSlots = this.googlePublisherTagService.getDefinedSlots();
    const deviceType = this.deviceService.getDeviceType();

    // This is needed for RichAudience initialization
    this.window['deviceType'] = deviceType;

    // RichAudience magic function
    this.fetchHeaderBids(allowSegmentation, slots, definedSlots);
    this.googlePublisherTagService.setPubAdsConfig();
  }

  private refreshHeaderBids(allowSegmentation: true): void {
    const slots = this.setSlotsSubject.getValue();
    const definedSlots = this.googlePublisherTagService.getDefinedSlots();

    this.fetchHeaderBids(allowSegmentation, slots, definedSlots);
  }
}
