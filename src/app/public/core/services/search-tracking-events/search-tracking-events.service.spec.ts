import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnalyticsEvent, ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS, Search } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { FILTER_PARAMETERS_SEARCH } from '@public/features/search/core/services/constants/filter-parameters';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTERS_SOURCE } from './enums/filters-source-enum';

import { SearchTrackingEventsService } from './search-tracking-events.service';

describe('SearchTrackingEventsService', () => {
  let service: SearchTrackingEventsService;
  let analyticsService: AnalyticsService;
  const searchId = 'searchId';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchTrackingEventsService, { provide: AnalyticsService, useClass: MockAnalyticsService }],
    });
    service = TestBed.inject(SearchTrackingEventsService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when search', () => {
    let event: AnalyticsEvent<Partial<Search>>;

    beforeEach(() => {
      spyOn(service, 'trackSearchEvent').and.callThrough();
      spyOn(analyticsService, 'trackEvent');

      event = {
        name: ANALYTICS_EVENT_NAMES.Search,
        eventType: ANALYTIC_EVENT_TYPES.Search,
        attributes: {
          screenId: SCREEN_IDS.Search,
          searchId: searchId,
        },
      };
    });

    describe('and no special filter names', () => {
      const value = 'brand';
      const filters: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.brand, value: value }];
      const jsonFilters = { brand: value };

      beforeEach(() => {
        event.attributes = { ...event.attributes, ...jsonFilters };
      });

      it('should send event with correct parameters', () => {
        service.trackSearchEvent(searchId, filters);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });

    describe('and kebbab case filter names', () => {
      const value = 'objectType';
      const filters: FilterParameter[] = [{ key: FILTER_QUERY_PARAM_KEY.objectType, value: value }];
      let jsonFilters;

      beforeEach(() => {
        jsonFilters = { [service['FILTER_KEY_EVENT_MAP'][FILTER_QUERY_PARAM_KEY.objectType]]: value };
        event.attributes = { ...event.attributes, ...jsonFilters };
      });

      it('should send event with correct parameters', () => {
        service.trackSearchEvent(searchId, filters);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });

    describe('and specific filter names', () => {
      const value = 'type';
      const filterSource = FILTERS_SOURCE.QUICK_FILTERS as Search['source'];
      const filters: FilterParameter[] = [
        { key: FILTER_QUERY_PARAM_KEY.type, value: value },
        { key: FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE as FILTER_QUERY_PARAM_KEY, value: filterSource },
      ];
      let jsonFilters;

      beforeEach(() => {
        jsonFilters = { [service['FILTER_KEY_EVENT_MAP'][FILTER_QUERY_PARAM_KEY.type]]: value, source: filterSource };
        event.attributes = { ...event.attributes, ...jsonFilters };
      });

      it('should send event with correct parameters', () => {
        service.trackSearchEvent(searchId, filters);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(event);
      });
    });
  });
});
