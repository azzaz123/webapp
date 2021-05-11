import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, map, tap } from 'rxjs/operators';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Injectable()
export class SearchQueryStringService {
  private currentParams: Params = {};
  public queryStringParams$ = this.buildQueryStringParamsObservable();

  constructor(private route: ActivatedRoute, private router: Router) {}

  public setQueryParams(filterParameters: FilterParameter[]): void {
    const newParameters = this.mapFilterToQueryParams(filterParameters);

    if (this.shouldNavigate(newParameters)) {
      this.router.navigate(['/search'], {
        queryParams: newParameters,
      });
    }
  }

  private mapQueryToFilterParams(params: Params): FilterParameter[] {
    const keys = Object.keys(params) as FILTER_QUERY_PARAM_KEY[];

    return keys.map((key) => ({
      key,
      value: params[key],
    }));
  }

  private mapFilterToQueryParams(params: FilterParameter[]): Params {
    return params.reduce(
      (accumulatedParams, newParam) => ({
        ...accumulatedParams,
        [newParam.key]: newParam.value,
      }),
      {}
    );
  }

  private shouldNavigate(newParameters: Params) {
    const currentKeys = Object.keys(this.currentParams);
    const newKeys = Object.keys(newParameters);

    if (currentKeys.length !== newKeys.length) {
      return true;
    }

    for (const currentKey of currentKeys) {
      if (!newKeys.includes(currentKey)) {
        return true;
      }

      const currentValue = this.currentParams[currentKey];

      if (currentValue !== newParameters[currentKey]) {
        return true;
      }
    }

    return false;
  }

  private buildQueryStringParamsObservable() {
    return this.route.queryParams.pipe(
      debounceTime(100),
      tap((params) => (this.currentParams = params)),
      map((params) => this.mapQueryToFilterParams(params))
    );
  }
}
