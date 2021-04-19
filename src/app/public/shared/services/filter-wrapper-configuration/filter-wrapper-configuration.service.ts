import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';
import {
  DEFAULT_FILTER_GROUP_CONFIG,
  FILTER_GROUP_CONFIG,
} from '@public/shared/services/filter-wrapper-configuration/data/filter-group-config';

@Injectable()
export class FilterWrapperConfigurationService {
  public getConfiguration(variant: FILTER_VARIANT, parameters: FilterParameter[]): FilterWrapperConfiguration {
    return FILTER_GROUP_CONFIG.filter((config) => this.isConfigAMatch(config, parameters)).reduce((previousConfig, currentConfig) => {
      if (currentConfig.params.length > (previousConfig?.params.length || 0)) {
        return currentConfig;
      }
    }, DEFAULT_FILTER_GROUP_CONFIG);
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
