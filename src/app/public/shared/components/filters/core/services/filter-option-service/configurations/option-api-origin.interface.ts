import { FilterOptionsMapperMethods } from '../filter-options-mapper.service';
import { FilterOptionsApiMethods } from '../filter-options-api.service';

export interface KeyMapper {
  sourceParamKey: string;
  destinationParamKey: string;
}

export interface ParamsConfiguration<T extends string> {
  method: T;
  requiredSiblingParams?: string[];
  keyMappers?: KeyMapper[];
}

export interface OptionsApiOrigin {
  apiConfiguration: ParamsConfiguration<FilterOptionsApiMethods>;
  mapperConfiguration?: ParamsConfiguration<FilterOptionsMapperMethods>;
}
