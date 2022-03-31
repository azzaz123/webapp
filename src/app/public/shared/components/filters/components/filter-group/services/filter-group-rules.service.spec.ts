import { TestBed } from '@angular/core/testing';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterGroupRulesService } from './filter-group-rules.service';
import { FilterGroupRules } from '../../../core/interfaces/filter-group-rules.interface';
import { COMMON_FILTERS } from '../../../core/constants/filters/common/common-filters';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../../../core/enums/configuration-ids/consumer-goods-configuration-ids.enum';
import { SimpleChange } from '@angular/core';

interface MockedHostConfig {
  filterConfig: { mapKey: Record<string, FILTER_QUERY_PARAM_KEY> };
  variant: FILTER_VARIANT;
}

describe('FilterGroupRulesService', () => {
  let service: FilterGroupRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterGroupRulesService],
    });
    service = TestBed.inject(FilterGroupRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for filter config ids to be reloaded', () => {
    describe('and value contains filters to be managed', () => {
      const value = new SimpleChange([], [{ key: FILTER_QUERY_PARAM_KEY.brand, value: 'brand' }], false);
      const rules: FilterGroupRules = {
        reload: [
          {
            parentParamKey: FILTER_QUERY_PARAM_KEY.brand,
            childFilterConfigId: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.OBJECT_TYPE,
          },
        ],
      };

      it('should return the correct filter config ids', () => {
        const expected = [rules.reload[0].childFilterConfigId];

        expect(service.getFilterConfigIdsToBeReloaded(rules.reload, value)).toEqual(expected);
      });
    });

    describe('and value does not contain filters to be managed', () => {
      const value = new SimpleChange([], [{ key: FILTER_QUERY_PARAM_KEY.condition, value: 'condition' }], false);
      const rules: FilterGroupRules = {
        reload: [
          {
            parentParamKey: FILTER_QUERY_PARAM_KEY.brand,
            childFilterConfigId: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.OBJECT_TYPE,
          },
        ],
      };

      it('should return the correct filter config ids', () => {
        const expected = [];

        expect(service.getFilterConfigIdsToBeReloaded(rules.reload, value)).toEqual(expected);
      });
    });

    describe('and rules does not contain filters to be managed', () => {
      const value = new SimpleChange([], [{ key: FILTER_QUERY_PARAM_KEY.condition, value: 'condition' }], false);
      const rules: FilterGroupRules = {
        reload: [],
      };

      it('should return the correct filter config ids', () => {
        const expected = [];

        expect(service.getFilterConfigIdsToBeReloaded(rules.reload, value)).toEqual(expected);
      });
    });
  });
});
