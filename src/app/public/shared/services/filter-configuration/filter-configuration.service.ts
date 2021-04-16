import { Injectable } from '@angular/core';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';
import { AvailableFilterConfig } from '@public/shared/components/filters/core/types/available-filter-config.type';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import {
  FilterWrapperConfiguration,
  ValueOf,
} from '@public/shared/components/filters/core/interfaces/filter-wrapper-configuration.interface';
import { FilterGroupConfig } from '@public/shared/services/filter-configuration/interfaces/filter-group-config.interface';
import { FILTER_GROUP_CONFIG } from '@public/shared/services/filter-configuration/data/filter-group-config';

@Injectable()
export class FilterConfigurationService {
  public getConfiguration(variant: FILTER_VARIANT, parameters: FilterParameter[]): AvailableFilterConfig[] {
    const configGroup = this.getConfigGroupByParameters(parameters);
    const configIds = variant === FILTER_VARIANT.BUBBLE ? configGroup.bubble : configGroup.drawer;
    return configIds.map((id) => this.getFilterConfigById(id));
  }

  private getFilterConfigById(filterConfigurationId: ValueOf<ConfigurationId>): AvailableFilterConfig {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }

  private getConfigGroupByParameters(parameters: FilterParameter[]): FilterWrapperConfiguration {
    return FILTER_GROUP_CONFIG.filter((config) => this.isConfigAMatch(config, parameters)).reduce((previousConfig, currentConfig) => {
      if (currentConfig.params.length > (previousConfig?.params.length || 0)) {
        return currentConfig;
      }
    }).config;
  }

  private isConfigAMatch(config: FilterGroupConfig, parameters: FilterParameter[]): boolean {
    for (const configParameter of config.params) {
      const parameter = parameters.find((param) => param.key === configParameter.key);
      if (!parameter || configParameter.value !== parameter.value) {
        return false;
      }
    }
    return true;
  }
}
