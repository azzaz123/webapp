import { Inject, Injectable } from '@angular/core';
import { AdTargetings } from '@core/ads/models/ad-targetings';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdShoppingPageOptions, AdSlotConfiguration, AdSlotShoppingBaseConfiguration } from '../../models';
import { GoogCsa } from './google-ads-sense-shopping';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  private static GOOGLE_ADS_SENSE_NAME = 'plas';
  private adSlotsNamesDefinedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private adSlotsLoadedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private adSlotsDefinedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(WINDOW_TOKEN) private window: Window,
    private cookieService: CookieService,
    private deviceService: DeviceService,
    private adsTargetingService: AdsTargetingsService
  ) {}

  public isLibraryRefDefined(): boolean {
    return this.googletag.apiReady;
  }

  public get isAdSlotsDefined$(): Observable<boolean> {
    return this.adSlotsDefinedSubject.asObservable();
  }

  public setSlots(adSlots: AdSlotConfiguration[]): void {
    const oldSlots: string[] = this.adSlotsNamesDefinedSubject.getValue();
    const newAdSlots: AdSlotConfiguration[] = adSlots.filter(({ name }: AdSlotConfiguration) => !oldSlots.includes(name));
    this.googletag.cmd.push(() => {
      this.defineSlots(newAdSlots);
      this.onSlotsDefined();
    });
  }

  private getSlots(adSlots: AdSlotConfiguration[]): googletag.Slot[] {
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

  public getDefinedSlots(): googletag.Slot[] {
    return googletag.pubads().getSlots();
  }

  public destroySlots(adSlotConfigurations: AdSlotConfiguration[]): void {
    this.googletag.cmd.push(() => {
      this.googletag.destroySlots(this.getSlots(adSlotConfigurations));
    });
  }

  public isAdSlotLoaded$(adSlot: AdSlotConfiguration): Observable<boolean> {
    return this.adSlotsLoaded$.pipe(map((slotNames: string[]) => slotNames.includes(adSlot.name)));
  }

  public setAdTargeting(adTargetings: AdTargetings): void {
    this.adsTargetingService.setAdTargeting(adTargetings);
  }

  public setTargetingByAdsKeywords(): void {
    const experimentationTargeting = this.getExperimentationTargeting();
    this.googletag.pubads().clearTargeting();

    if (experimentationTargeting) {
      this.adsTargetingService.setAdTargeting(experimentationTargeting);
    }

    const adTargetings: AdTargetings = this.adsTargetingService.adTargetings;
    this.googletag.cmd.push(() => {
      for (const key in adTargetings) {
        if (adTargetings.hasOwnProperty(key) && adTargetings[key]) {
          this.googletag.pubads().setTargeting(key, adTargetings[key]);
        }
      }
    });
  }

  public refreshSlots(adSlotConfigurations: AdSlotConfiguration[]): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().refresh(this.getSlots(adSlotConfigurations));
    });
  }

  public refreshAllSlots(): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().refresh();
    });
  }

  public clearSlots(adSlotConfigurations: AdSlotConfiguration[]): void {
    this.googletag.cmd.push(() => {
      this.googletag.pubads().clear(this.getSlots(adSlotConfigurations));
    });
  }

  public displayShopping(pageOptions: AdShoppingPageOptions, adSlotShopping: AdSlotShoppingBaseConfiguration[]): void {
    const { content }: AdTargetings = this.adsTargetingService.adTargetings;
    this.googCsa(GooglePublisherTagService.GOOGLE_ADS_SENSE_NAME, { ...pageOptions, query: content }, adSlotShopping);
  }

  public setPubAdsConfig(): void {
    const publisherId: string = this.getPublisherId();

    this.googletag.pubads().enableSingleRequest();
    this.googletag.pubads().collapseEmptyDivs();
    this.googletag.pubads().disableInitialLoad();
    this.googletag.pubads().setPublisherProvidedId(publisherId);
    this.googletag.pubads().addEventListener('slotOnload', (event: googletag.events.Event) => this.onSlotLoad(event));

    this.googletag.enableServices();
  }

  private getPublisherId(): string {
    return this.cookieService.get('publisherId') ?? '-1' + Array(31).join('0');
  }

  private defineSlots(slots: AdSlotConfiguration[]): void {
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

  private onSlotsDefined(): void {
    this.adSlotsDefinedSubject.next(true);
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

  private getExperimentationTargeting() {
    const value = this.googletag.pubads().getTargeting('MwebSearchLayout');

    return value.length > 0 ? { MwebSearchLayout: value[0] } : null;
  }
}
