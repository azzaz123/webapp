import { Injectable } from '@angular/core';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';
import { AvailableFilterConfig } from '@public/shared/components/filters/core/types/available-filter-config.type';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { CAR_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/car/car-filter-configuration';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { FilterIdConfiguration, ValueOf } from '@public/shared/components/filters/core/interfaces/filter-id-configuration.interface';

@Injectable()
export class FilterConfigurationService {
  getConfiguration(variant: FILTER_VARIANT, parameters: FilterParameter[]): AvailableFilterConfig[] {
    const configGroup = this.getConfigGroupByParameters(parameters);
    const configIds = variant === FILTER_VARIANT.BUBBLE ? configGroup.bubble : configGroup.drawer;
    return configIds.map((id) => this.getFilterConfigById(id));
  }

  private getFilterConfigById(filterConfigurationId: ValueOf<ConfigurationId>): AvailableFilterConfig {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }

  private getConfigGroupByParameters(parameters: FilterParameter[]): FilterIdConfiguration {
    return CAR_FILTER_CONFIGURATION;
  }
}
