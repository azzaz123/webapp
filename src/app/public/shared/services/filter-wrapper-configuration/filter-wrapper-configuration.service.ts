import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';
import {
  DEFAULT_FILTER_WRAPPER_CONFIG,
  FILTER_WRAPPER_CONFIGS,
} from '@public/shared/services/filter-wrapper-configuration/data/filter-group-config';

@Injectable()
export class FilterWrapperConfigurationService {
  public getConfiguration(parameters: FilterParameter[]): FilterWrapperConfiguration {
    return FILTER_WRAPPER_CONFIGS.filter((config) => this.isConfigAMatch(config, parameters)).reduce((previousConfig, currentConfig) => {
      if (currentConfig.params.length > (previousConfig?.params.length || 0)) {
        return currentConfig;
      }
      return previousConfig;
    }, DEFAULT_FILTER_WRAPPER_CONFIG);
  }

  private isConfigAMatch(config: FilterWrapperConfiguration, parameters: FilterParameter[]): boolean {
    for (const configParameter of config.params) {
      const parameter = parameters.find((param) => param.key === configParameter.key);
      if (!parameter || configParameter.value !== parameter.value) {
        return false;
      }
    }
    return true;
  }
}
