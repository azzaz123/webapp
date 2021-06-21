import { Inject, Injectable } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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

  public close(): void {
    this.subscription.unsubscribe();
  }

  private setAdKeywordsObservable(): Subscription {
    return this.filterParameterStoreService.parameters$
      .pipe(map((filterParameters: FilterParameter[]) => filterParameters.find(({ key }) => key === FILTER_QUERY_PARAM_KEY.keywords)))
      .subscribe((filterKeyword: FilterParameter) => {
        const content = filterKeyword?.value || null;
        this.adsService.setAdKeywords({ content });
        this.adsService.refresh();
      });
  }
}
