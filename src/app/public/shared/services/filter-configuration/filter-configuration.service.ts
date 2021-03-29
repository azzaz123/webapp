import { Injectable } from '@angular/core';
import { CAR_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/car/car-filter-configuration';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterConfigurations } from './interfaces/filter-group-config.interface';

@Injectable()
export class FilterConfigurationService {
  getConfiguration(parameters: FilterParameter[]): FilterConfigurations {
    const configurationFilters = CAR_FILTER_CONFIGURATION;
    const filters: FilterConfigurations = {
      bubble: [],
      drawer: [],
    };

    configurationFilters.bubble.forEach((filterConfigurationId: any) => {
      // TODO REMOVE THAT ANY
      filters.bubble.push(this.getFilterConfigById(filterConfigurationId));
    });

    configurationFilters.drawer.forEach((filterConfigurationId: any) => {
      // TODO REMOVE THAT ANY

      filters.drawer.push(this.getFilterConfigById(filterConfigurationId));
    });

    return filters;
  }

  private getFilterConfigById(filterConfigurationId: string): FilterConfig<unknown> {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }
}
