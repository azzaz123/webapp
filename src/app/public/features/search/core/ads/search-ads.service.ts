import { Inject, Injectable } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subscription } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { AD_PUBLIC_SEARCH } from './search-ads.config';

export const SEARCH_SLOTS = [
  AD_PUBLIC_SEARCH.topBanner,
  AD_PUBLIC_SEARCH.pos1Right,
  AD_PUBLIC_SEARCH.pos2Right,
  AD_PUBLIC_SEARCH.mobileTopBanner,
  AD_PUBLIC_SEARCH.mobilePos1,
  AD_PUBLIC_SEARCH.mobilePos2,
];

@Injectable()
export class SearchAdsService {
  private subscriptionInit: Subscription = new Subscription();
  private subscriptionRefresh: Subscription = new Subscription();

  constructor(
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService,
    private adsService: AdsService,
    private adsTargetingsService: AdsTargetingsService
  ) {}

  public init(): void {
    this.subscriptionInit.add(this.listenerToAdsInit());
    this.subscriptionRefresh.add(this.listenerToAdsRefresh());
  }

  public clearSlots(): void {
    this.adsService.clearSlots(SEARCH_SLOTS);
  }

  public refreshSlots(): void {
    this.adsService.refreshSlots(SEARCH_SLOTS);
  }

  public destroySlots(): void {
    this.adsService.destroySlots(SEARCH_SLOTS);
  }

  private listenerToAdsInit(): Subscription {
    return this.filterParameterStoreService.parameters$.pipe(take(1)).subscribe((parameters) => {
      this.adsTargetingsService.setAdTargetings(parameters);
      this.adsService.init();
    });
  }

  private listenerToAdsRefresh(): Subscription {
    return this.filterParameterStoreService.parameters$.pipe(skip(1)).subscribe((parameters) => {
      this.adsTargetingsService.setAdTargetings(parameters);
      this.adsService.refreshAllSlots();
    });
  }
}
