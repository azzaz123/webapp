import { SearchQueryStringService } from './search-query-string.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

describe('QueryStringServiceService', () => {
  let service: SearchQueryStringService;

  beforeEach(() => {
    service = new SearchQueryStringService();
  });

  describe('when formatting query params to filter params', () => {
    it('should format the params', () => {
      const filterParams = service.mapQueryToFilterParams({ category_ids: '200' });

      expect(filterParams).toEqual([{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }]);
    });
  });

  describe('when formatting filter params to query params', () => {
    it('should format the params', () => {
      const queryParams = service.mapFilterToQueryParams([{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: '200' }]);

      expect(queryParams).toEqual({ category_ids: '200' });
    });
  });
});
