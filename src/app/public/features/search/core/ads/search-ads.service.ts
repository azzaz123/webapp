import { Inject, Injectable } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdsTargetingsService } from '@core/ads/services/ads-targetings/ads-targetings.service';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { AD_PUBLIC_SEARCH } from './search-ads.config';

export const SEARCH_SLOTS = [AD_PUBLIC_SEARCH.search1, AD_PUBLIC_SEARCH.search2r, AD_PUBLIC_SEARCH.search3r];

@Injectable()
export class SearchAdsService {
  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService,
    private adsService: AdsService,
    private adsTargetingsService: AdsTargetingsService
  ) {}

  public init(): void {
    this.subscription.add(this.listenerToAdsRefresh());
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

  public close(): void {
    this.subscription.unsubscribe();
  }

  private listenerToAdsRefresh(): Subscription {
    return this.filterParameterStoreService.parameters$.pipe(skip(1)).subscribe(() => {
      this.adsTargetingsService.refreshAdTargetings();
      this.adsService.refreshAllSlots();
    });
  }
}
