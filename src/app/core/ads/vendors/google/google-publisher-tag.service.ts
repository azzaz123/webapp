import { Inject, Injectable } from '@angular/core';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdKeyWords, AdShoppingPageOptions, AdSlotConfiguration, AdSlotId, AdSlotShoppingBaseConfiguration } from '../../models';
import { GoogCsa } from './google-ads-sense-shopping';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  private static GOOGLE_ADS_SENSE_NAME = 'plas';
  private adSlotsNamesDefinedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private adSlotsLoadedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private cookieService: CookieService,
    private adsKeywordsService: AdsKeywordsService,
    private deviceService: DeviceService
  ) {}

  public isLibraryRefDefined(): boolean {
    return !!this.googletag && this.googletag.apiReady;
  }

  public setSlots(adSlots: AdSlotConfiguration[]): void {
    const oldSlots: string[] = this.adSlotsNamesDefinedSubject.getValue();
    const newAdSlots: AdSlotConfiguration[] = adSlots.filter(({ name }: AdSlotConfiguration) => !oldSlots.includes(name));
    this.googletag.cmd.push(() => {
      this.definedSlots(newAdSlots);
      this.setPubads();
      this.googletag.enableServices();
      this.googletag.pubads().addEventListener('slotOnload', (event: googletag.events.Event) => this.onSlotLoad(event));
    });
  }

  public getSlots(adSlots: AdSlotConfiguration[]): googletag.Slot[] {
    const slots: googletag.Slot[] = [];

    adSlots.forEach((slotConfig) => {
      const slot = this.googletag
        .pubads()
        .getSlots()
        .find((slot) => slot.getAdUnitPath() === slotConfig.name);

      slots.push(slot);
    });

    return slots;
  }

  public destroySlots(adSlots: googletag.Slot[]): void {
    this.googletag.destroySlots(adSlots);
  }

  public reset(): void {
    this.adSlotsNamesDefinedSubject.next([]);
    this.adSlotsLoadedSubject.next([]);
  }

  public isAdSlotLoaded$(adSlot: AdSlotConfiguration): Observable<boolean> {
    return this.adSlotsLoaded$.pipe(map((slotNames: string[]) => slotNames.includes(adSlot.name)));
  }

  public setAdKeywords(adKeywords: AdKeyWords): void {
    this.adsKeywordsService.saveCustomKeywords(adKeywords);
  }

  public setAdsSegmentation(allowSegmentation = false): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().setRequestNonPersonalizedAds(allowSegmentation ? 0 : 1);
    });
  }

  public setTargetingByAdsKeywords(allowSegmentation = false): void {
    this.adsKeywordsService.loadAdKeywords();

    const adKeywords: AdKeyWords = this.adsKeywordsService.adKeywords;
    this.googletag.cmd.push(() => {
      for (const key in adKeywords) {
        if (adKeywords.hasOwnProperty(key) && adKeywords[key]) {
          this.googletag.pubads().setTargeting(key, adKeywords[key]);
        }
      }
      this.googletag.pubads().setTargeting('allowSegmentation', allowSegmentation.toString());
    });
  }

  public refreshSlots(adSlots: googletag.Slot[]): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().refresh(adSlots);
    });
  }

  public refreshAllSlots(): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().refresh();
    });
  }

  public clearSlots(adSlots: googletag.Slot[]): void {
    googletag.cmd.push(() => {
      googletag.pubads().clear(adSlots);
    });
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    this.googletag.cmd.push(() => {
      this.googletag.display(slotId);
    });
  }

  public displayShopping(pageOptions: AdShoppingPageOptions, adSlotShopping: AdSlotShoppingBaseConfiguration): void {
    this.adsKeywordsService.loadAdKeywords();

    const { content }: AdKeyWords = this.adsKeywordsService.adKeywords;
    this.googCsa(GooglePublisherTagService.GOOGLE_ADS_SENSE_NAME, { ...pageOptions, query: content }, adSlotShopping);
  }

  private setPubads(): void {
    this.googletag.pubads().enableSingleRequest();
    this.googletag.pubads().collapseEmptyDivs();
    this.googletag.pubads().disableInitialLoad();

    const publisherId: string = this.getPublisherId();
    this.googletag.pubads().setPublisherProvidedId(publisherId);
  }

  private getPublisherId(): string {
    return this.cookieService.get('publisherId') ?? '-1' + Array(31).join('0');
  }

  private definedSlots(slots: AdSlotConfiguration[]): void {
    const deviceType: DeviceType = this.deviceService.getDeviceType();
    slots
      .filter((slot) => slot.device.includes(deviceType))
      .forEach((slot) => {
        let mappingResponsive: googletag.SizeMappingArray;
        if (slot.sizeMapping) {
          mappingResponsive = this.googletag
            .sizeMapping()
            .addSize(slot.sizeMapping.desktop.screenSize, slot.sizeMapping.desktop.mapping)
            .addSize(slot.sizeMapping.tablet.screenSize, slot.sizeMapping.tablet.mapping)
            .addSize(slot.sizeMapping.mobile.screenSize, slot.sizeMapping.mobile.mapping)
            .build();
        }
        const defineSlot = this.googletag.defineSlot(slot.name, slot.sizes, slot.id);

        if (defineSlot) {
          defineSlot
            .defineSizeMapping(slot.sizeMapping && mappingResponsive)
            .setTargeting('ad_group', 'ad_opt')
            .setTargeting('ad_h', new Date().getUTCHours().toString())
            .addService(this.googletag.pubads());

          const slotsDefined: string[] = this.adSlotsNamesDefinedSubject.getValue();
          this.adSlotsNamesDefinedSubject.next([...slotsDefined, slot.name]);
        }
      });
  }

  private onSlotLoad(event: googletag.events.Event): void {
    const slotsName: string[] = this.adSlotsLoadedSubject.getValue();
    const slotName = event.slot.getAdUnitPath();
    slotsName.push(slotName);
    const newSlotsName: string[] = [...new Set(slotsName).values()];
    this.adSlotsLoadedSubject.next(newSlotsName);
  }

  get googletag(): googletag.Googletag {
    return this.window['googletag'] || { cmd: [], apiReady: false };
  }

  private get googCsa(): GoogCsa {
    return this.window && this.window['_googCsa'];
  }

  private get adSlotsLoaded$(): Observable<string[]> {
    return this.adSlotsLoadedSubject.asObservable();
  }
}
