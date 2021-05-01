import { Pipe, PipeTransform } from '@angular/core';
import { FilterGroupConfiguration } from '@public/shared/services/filter-group-configuration/interfaces/filter-group-config.interface';
import { AvailableFilterConfig } from '@public/shared/components/filters/core/types/available-filter-config.type';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { ValueOf } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { FILTER_CONFIGURATIONS } from '@public/shared/components/filters/core/constants/filters/filter-configurations';
import { DEFAULT_FILTER_GROUP_CONFIG } from '@public/shared/services/filter-group-configuration/data/filter-group-config';

@Pipe({
  name: 'extractFilterConfigs',
})
export class ExtractFilterConfigsPipe implements PipeTransform {
  public transform(groupConfig: FilterGroupConfiguration, variant: FILTER_VARIANT): AvailableFilterConfig[] {
    groupConfig = groupConfig || DEFAULT_FILTER_GROUP_CONFIG;
    const filterIds = variant === FILTER_VARIANT.BUBBLE ? groupConfig.config.bubble : groupConfig.config.drawer;
    return filterIds.map((id) => this.getFilterConfigById(id));
  }

  private getFilterConfigById(filterConfigurationId: ValueOf<ConfigurationId>): AvailableFilterConfig {
    return FILTER_CONFIGURATIONS.find((filterConfiguration) => filterConfiguration.id === filterConfigurationId);
  }
}
