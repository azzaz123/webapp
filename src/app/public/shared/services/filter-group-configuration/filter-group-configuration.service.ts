import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterGroupConfiguration } from '@public/shared/services/filter-group-configuration/interfaces/filter-group-config.interface';
import {
  DEFAULT_FILTER_GROUP_CONFIG,
  FILTER_GROUP_CONFIGS,
} from '@public/shared/services/filter-group-configuration/data/filter-group-config';

@Injectable()
export class FilterGroupConfigurationService {
  public getConfiguration(parameters: FilterParameter[]): FilterGroupConfiguration {
    return FILTER_GROUP_CONFIGS.filter((config) => this.isConfigAMatch(config, parameters)).reduce((previousConfig, currentConfig) => {
      if (currentConfig.params.length > (previousConfig?.params.length || 0)) {
        return currentConfig;
      }
      return previousConfig;
    }, DEFAULT_FILTER_GROUP_CONFIG);
  }

  private isConfigAMatch(config: FilterGroupConfiguration, parameters: FilterParameter[]): boolean {
    for (const configParameter of config.params) {
      const parameter = parameters.find((param) => param.key === configParameter.key);
      if (!parameter || configParameter.value !== parameter.value) {
        return false;
      }
    }
    return true;
  }
}
