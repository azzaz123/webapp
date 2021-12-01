import { Inject, Injectable } from '@angular/core';
import { AdShoppingPageOptions, AdSlotShoppingBaseConfiguration } from '@core/ads/models';
import { AdSlotConfiguration } from '@core/ads/models/ad-slot-configuration';
import { AdTargetings } from '@core/ads/models/ad-targetings';
import { DidomiService } from '@core/ads/vendors/didomi/didomi.service';
import { DeviceService } from '@core/device/device.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { GooglePublisherTagService } from '../../vendors';
import { LoadAdsService } from '../load-ads/load-ads.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private readonly setSlotsSubject: BehaviorSubject<AdSlotConfiguration[]> = new BehaviorSubject<AdSlotConfiguration[]>([]);
  private readonly _adsReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly refreshSlotsSubject: Subject<void> = new Subject();

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
    this.listenerToRefreshSlots();
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
    this.refreshSlotsSubject.next();
  }

  public clearSlots(adSlots: AdSlotConfiguration[]): void {
    this.googlePublisherTagService.clearSlots(adSlots);
  }

  public setAdKeywords(adTargetings: AdTargetings): void {
    this.googlePublisherTagService.setAdTargeting(adTargetings);
  }

  public setTargetingByAdsKeywords(): void {
    this.googlePublisherTagService.setTargetingByAdsKeywords();
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

  private get refreshHeaderBids(): Function {
    return this.window['refreshHeaderBids'];
  }

  private listenerToSetSlots(): void {
    combineLatest([this.adsReady$, this.setSlotsSubject.asObservable()])
      .pipe(
        filter(([adsReady, adSlots]: [boolean, AdSlotConfiguration[]]) => adsReady && adSlots.length > 0),
        map(([_, adSlots]: [boolean, AdSlotConfiguration[]]) => adSlots)
      )
      .subscribe((adSlots: AdSlotConfiguration[]) => {
        this.googlePublisherTagService.setTargetingByAdsKeywords();
        this.googlePublisherTagService.setSlots(adSlots);
      });
  }

  private listenerToDisplaySlots(): void {
    combineLatest([this.adsReady$, this.adSlotsDefined$, this.allowSegmentation$])
      .pipe(
        filter(([adsReady, adSlotsDefined]: [boolean, boolean, boolean]) => adsReady && adSlotsDefined),
        map(([adsReady, adSlotsDefined, allowSegmentation]: [boolean, boolean, boolean]) => allowSegmentation)
      )
      .subscribe((allowSegmentation: boolean) => {
        this.callFetchHeaderBids(allowSegmentation);
      });
  }

  private listenerToRefreshSlots(): void {
    combineLatest([this.allowSegmentation$, this.refreshSlotsSubject.asObservable()])
      .pipe(map(([allowSegmentation, refreshSlots]: [boolean, void]) => allowSegmentation))
      .subscribe((allowSegmentation: boolean) => {
        this.googlePublisherTagService.setTargetingByAdsKeywords();
        this.callRefreshHeaderBids(allowSegmentation);
      });
  }

  private callFetchHeaderBids(allowSegmentation: boolean): void {
    const slots = this.setSlotsSubject.getValue();
    const definedSlots = this.googlePublisherTagService.getDefinedSlots();
    const deviceType = this.deviceService.getDeviceType();

    // This is needed for RichAudience initialization
    this.window['deviceType'] = deviceType;

    // RichAudience magic function
    this.fetchHeaderBids(allowSegmentation, slots, definedSlots);
    this.googlePublisherTagService.setPubAdsConfig();
  }

  private callRefreshHeaderBids(allowSegmentation: boolean): void {
    const slots = this.setSlotsSubject.getValue();
    const definedSlots = this.googlePublisherTagService.getDefinedSlots();

    this.refreshHeaderBids(allowSegmentation, slots, definedSlots);
  }
}
