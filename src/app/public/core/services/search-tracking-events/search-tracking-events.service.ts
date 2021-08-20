import { Injectable } from '@angular/core';
import { SORT_BY } from '@api/core/model';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS, Search } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Injectable()
export class SearchTrackingEventsService {
  private readonly FILTER_KEY_EVENT_MAP = {
    [FILTER_QUERY_PARAM_KEY.categoryId]: 'categoryId',
    [FILTER_QUERY_PARAM_KEY.condition]: 'itemCondition',
    [FILTER_QUERY_PARAM_KEY.objectType]: 'objectTypeId',
    [FILTER_QUERY_PARAM_KEY.type]: 'propertyType',
    [FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE]: 'source',
  };

  private readonly ORDER_BY_VALUE_MAP = {
    [SORT_BY.DISTANCE]: 'distance',
    [SORT_BY.NEWEST]: 'newest',
    [SORT_BY.PRICE_HIGH_TO_LOW]: 'price_high_to_low',
    [SORT_BY.PRICE_LOW_TO_HIGH]: 'price_low_to_high',
    [SORT_BY.RELEVANCE]: 'most_relevant',
  };

  constructor(private analyticsService: AnalyticsService) {}

  public trackSearchEvent(searchId: string, filterParams: FilterParameter[]): void {
    const event: AnalyticsEvent<Search> = {
      name: ANALYTICS_EVENT_NAMES.Search,
      eventType: ANALYTIC_EVENT_TYPES.Search,
      attributes: {
        screenId: SCREEN_IDS.Search,
        searchId: searchId,
        ...this.fromFilterParameterEventFilter(filterParams),
      } as Search,
    };

    this.analyticsService.trackEvent(event);
  }

  private fromFilterParameterEventFilter(filterParams: FilterParameter[]): Partial<Search> {
    const filters = {};
    const FILTER_KEY_EVENT_MAP_KEYS = Object.keys(this.FILTER_KEY_EVENT_MAP);

    filterParams.forEach((parameter) => {
      if (parameter.key === FILTER_QUERY_PARAM_KEY.orderBy) {
        parameter.value = this.ORDER_BY_VALUE_MAP[parameter.value];
      }

      FILTER_KEY_EVENT_MAP_KEYS.includes(parameter.key)
        ? (filters[this.FILTER_KEY_EVENT_MAP[parameter.key]] = parameter.value)
        : (filters[this.camelize(parameter.key)] = parameter.value);
    });

    return filters;
  }

  private camelize(str: string): string {
    const arr = str.split('_');
    const capital = arr.map((item, index) => (index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()));
    return capital.join('');
  }
}
