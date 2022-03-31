import { Injectable, SimpleChange } from '@angular/core';
import { FilterGroupReloadRule } from '../../../core/interfaces/filter-group-rules.interface';
import { ConfigurationId } from '../../../core/types/configuration-id.type';

@Injectable()
export class FilterGroupRulesService {
  public getFilterConfigIdsToBeReloaded(
    reloadRules: FilterGroupReloadRule[],
    values: SimpleChange
  ): ConfigurationId[keyof ConfigurationId][] {
    const parentParamKeysWithReloadRules = reloadRules?.map((rule) => rule.parentParamKey);

    return parentParamKeysWithReloadRules
      ?.filter((parentParamKey) => {
        const previousValue = values.previousValue.find((value) => value.key === parentParamKey)?.value;
        const currentValue = values.currentValue.find((value) => value.key === parentParamKey)?.value;

        return previousValue !== currentValue;
      })
      .map((parentParamKeyToBeReloaded) => {
        return reloadRules?.find((rule) => {
          return rule.parentParamKey === parentParamKeyToBeReloaded;
        })?.childFilterConfigId;
      });
  }
}
