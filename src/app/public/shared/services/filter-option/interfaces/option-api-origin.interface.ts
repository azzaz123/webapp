import { FilterOptionsMapperMethods } from '../services/filter-options-mapper.service';
import { FilterOptionsApiMethods } from '../services/filter-options-api.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface KeyMapper {
  sourceParamKey: string;
  destinationParamKey: string;
}

export interface ParamsConfiguration<T extends string> {
  method: T;
  requiredSiblingParams?: FILTER_QUERY_PARAM_KEY[];
  keyMappers?: KeyMapper[];
}

export interface OptionsApiOrigin {
  apiConfiguration: ParamsConfiguration<FilterOptionsApiMethods>;
  mapperConfiguration?: ParamsConfiguration<FilterOptionsMapperMethods>;
}
