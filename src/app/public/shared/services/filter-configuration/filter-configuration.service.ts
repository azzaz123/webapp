import { Injectable } from '@angular/core';
import { CAR_CONFIGURATION_FILTERS } from '@public/shared/components/filters/core/enums/configuration/car/car-configuration-filters';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/enums/configuration/filter-configurations';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterConfigurations } from './interfaces/filter-group-config.interface';

@Injectable()
export class FilterConfigurationService {
  getConfiguration(parameters: FilterParameter[]): FilterConfigurations {
    const configurationFilters = CAR_CONFIGURATION_FILTERS;
    const filters: FilterConfigurations = {
      bubble: [],
      drawer: [],
    };

    configurationFilters.bubble.forEach((filterConfigurationId: string) => {
      filters.bubble.push(this.getFilterConfigById(filterConfigurationId));
    });

    configurationFilters.drawer.forEach((filterConfigurationId: string) => {
      filters.drawer.push(this.getFilterConfigById(filterConfigurationId));
    });

    return filters;
  }

  private getFilterConfigById(filterConfigurationId: string): FilterConfig<any> {
    // TODO REMOVE THAT ANY
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }
}
