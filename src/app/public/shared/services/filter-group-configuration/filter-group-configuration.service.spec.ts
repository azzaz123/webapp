import { TestBed } from '@angular/core/testing';
import { FilterGroupConfigurationService } from './filter-group-configuration.service';
import { FILTER_GROUP_ID } from '@public/shared/services/filter-group-configuration/enum/filter-group-id.enum';
import {
  DEFAULT_FILTER_GROUP_CONFIG,
  FILTER_GROUP_CONFIGS,
} from '@public/shared/services/filter-group-configuration/data/filter-group-config';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';

describe('FilterGroupConfigurationService', () => {
  let service: FilterGroupConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterGroupConfigurationService],
    });
    service = TestBed.inject(FilterGroupConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When no parameters present', () => {
    it('should return default configuration group', () => {
      const config = service.getConfiguration([]);

      expect(config).toEqual(DEFAULT_FILTER_GROUP_CONFIG);
    });
  });

  describe('When parameters have only one match', () => {
    it('should return the matching configuration group', () => {
      const config = service.getConfiguration([{ key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.SERVICES.toString() }]);

      expect(config).toEqual(findConfigById(FILTER_GROUP_ID.SERVICES));
    });
  });

  describe('When parameters have more than one match', () => {
    it('should return the most restrictive matching configuration group', () => {
      const config = service.getConfiguration([
        { key: FILTER_QUERY_PARAM_KEY.categoryId, value: CATEGORY_IDS.REAL_ESTATE.toString() },
        { key: FILTER_QUERY_PARAM_KEY.operation, value: REAL_ESTATE_SPECIFICATION_TYPE.BUY },
        { key: FILTER_QUERY_PARAM_KEY.type, value: REAL_ESTATE_SPECIFICATION_TYPE.HOUSE },
      ]);

      expect(config).toEqual(findConfigById(FILTER_GROUP_ID.REAL_ESTATE_BUY_HOUSE));
    });
  });

  function findConfigById(id: FILTER_GROUP_ID) {
    return FILTER_GROUP_CONFIGS.find((config) => config.id === id);
  }
});
