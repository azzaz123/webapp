import { filter, map } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AdKeyWords, AdShoppingPageOptions, AdSlotConfiguration, AdSlotId, AdSlotShoppingBaseConfiguration } from '../../models';
import { GoogCsa } from './google-ads-sense-shopping';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  private static GOOGLE_ADS_SENSE_NAME = 'plas';

  get googletag(): googletag.Googletag {
    return this.window['googletag'];
  }

  private get googCsa(): GoogCsa {
    return this.window && this.window['_googCsa'];
  }

  private adSlotsLoadedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  get adSlotsLoaded$(): Observable<string[]> {
    return this.adSlotsLoadedSubject.asObservable();
  }

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
    this.googletag.cmd.push(() => {
      this.definedSlots(adSlots);
      this.setPubads();
      this.googletag.enableServices();
      this.googletag.pubads().addEventListener('slotOnload', (event) => {
        const slotName = event.slot.getAdUnitPath();
        console.log('slotOnload', slotName);
        const slotsName: string[] = this.adSlotsLoadedSubject.getValue();
        slotsName.push(slotName);
        const newSlotsName: string[] = [...new Set(slotsName).values()];
        console.log(newSlotsName);
        this.adSlotsLoadedSubject.next(newSlotsName);
      });
    });
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

  public refreshAds(): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().refresh();
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
        }
      });
  }
}
