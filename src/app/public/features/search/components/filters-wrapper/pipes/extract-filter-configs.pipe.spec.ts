import { TestBed } from '@angular/core/testing';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';
import { FILTER_GROUP_ID } from '@public/shared/services/filter-wrapper-configuration/enum/filter-group-id.enum';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { ExtractFilterConfigsPipe } from './extract-filter-configs.pipe';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { ValueOf } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { AvailableFilterConfig } from '@public/shared/components/filters/core/types/available-filter-config.type';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';

describe('IsComplexIconPipe', () => {
  const pipe: ExtractFilterConfigsPipe = new ExtractFilterConfigsPipe();

  const config: FilterWrapperConfiguration = {
    id: FILTER_GROUP_ID.OTHER,
    config: {
      bubble: [COMMON_CONFIGURATION_ID.CATEGORIES],
      drawer: [COMMON_CONFIGURATION_ID.CATEGORIES, COMMON_CONFIGURATION_ID.POSTED_AGO],
    },
    params: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtractFilterConfigsPipe],
    }).compileComponents();
  });

  it('should return true when variant is bubble', () => {
    const filterConfigs = pipe.transform(config, FILTER_VARIANT.BUBBLE);

    expect(filterConfigs).toEqual(config.config.bubble.map(getFilterConfigById));
  });

  it('should return false when variant is content', () => {
    const filterConfigs = pipe.transform(config, FILTER_VARIANT.CONTENT);

    expect(filterConfigs).toEqual(config.config.drawer.map(getFilterConfigById));
  });

  function getFilterConfigById(filterConfigurationId: ValueOf<ConfigurationId>): AvailableFilterConfig {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }
});
