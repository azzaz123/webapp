import { Inject, Injectable } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subscription } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { AD_PUBLIC_SEARCH } from './search-ads.config';

export const SEARCH_SLOTS = [AD_PUBLIC_SEARCH.search1, AD_PUBLIC_SEARCH.search2r, AD_PUBLIC_SEARCH.search3r];

@Injectable()
export class SearchAdsService {
  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService,
    private adsService: AdsService
  ) {}

  public init(): void {
    this.subscription.add(this.setAdKeywordsObservable());
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

  private setAdKeywordsObservable(): Subscription {
    return this.filterParameterStoreService.parameters$
      .pipe(
        skip(1),
        map((filterParameters: FilterParameter[]) => filterParameters.find(({ key }) => key === FILTER_QUERY_PARAM_KEY.keywords))
      )
      .subscribe((filterKeyword: FilterParameter) => {
        const content = filterKeyword?.value || null;

        this.adsService.setAdKeywords({ content });
        this.adsService.refreshAllSlots();
      });
  }
}
