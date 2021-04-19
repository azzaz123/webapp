import { Pipe, PipeTransform } from '@angular/core';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';
import { AvailableFilterConfig } from '@public/shared/components/filters/core/types/available-filter-config.type';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { ValueOf } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';
import { DEFAULT_FILTER_GROUP_CONFIG } from '@public/shared/services/filter-wrapper-configuration/data/filter-group-config';

@Pipe({
  name: 'extractFilterConfigs',
})
export class ExtractFilterConfigsPipe implements PipeTransform {
  public transform(
    groupConfig: FilterWrapperConfiguration = DEFAULT_FILTER_GROUP_CONFIG,
    variant: FILTER_VARIANT
  ): AvailableFilterConfig[] {
    const filterIds = variant === FILTER_VARIANT.BUBBLE ? groupConfig.config.bubble : groupConfig.config.drawer;
    return filterIds.map((id) => this.getFilterConfigById(id));
  }

  private getFilterConfigById(filterConfigurationId: ValueOf<ConfigurationId>): AvailableFilterConfig {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }
}
