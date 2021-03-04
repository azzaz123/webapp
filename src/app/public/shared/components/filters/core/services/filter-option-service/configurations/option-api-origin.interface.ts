import { FilterOptionsMapperService } from '../filter-options-mapper.service';
import { FilterOptionsApiService } from '../filter-options-api.service';

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
  apiConfiguration: ParamsConfiguration<keyof Omit<FilterOptionsApiService, 'httpClient'>>;
  mapperConfiguration?: ParamsConfiguration<keyof FilterOptionsMapperService>;
}
