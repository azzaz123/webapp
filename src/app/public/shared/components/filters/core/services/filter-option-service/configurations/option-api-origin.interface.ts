import { FilterOptionsMapperService } from '../filter-options-mapper.service';
import { FilterOptionsApiService } from '../filter-options-api.service';

export interface OptionsApiOrigin {
  apiMethod: keyof Omit<FilterOptionsApiService, 'httpClient'>;
  apiRelatedFilterKeys?: string[];
  mapperMethod?: keyof FilterOptionsMapperService;
  mapperRelatedFilterKeys?: string[];
}
