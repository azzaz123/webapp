import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Params } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Injectable()
export class SearchQueryStringService {
  public mapQueryToFilterParams(params: Params): FilterParameter[] {
    const keys = Object.keys(params) as FILTER_QUERY_PARAM_KEY[];

    return keys.map((key) => ({
      key,
      value: params[key],
    }));
  }

  public mapFilterToQueryParams(params: FilterParameter[]): Params {
    return params.reduce(
      (accumulatedParams, newParam) => ({
        ...accumulatedParams,
        [newParam.key]: newParam.value,
      }),
      {}
    );
  }
}
