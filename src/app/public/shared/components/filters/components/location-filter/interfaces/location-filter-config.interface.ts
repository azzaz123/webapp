import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { LocationFilterParams } from './location-filter-params.interface';

export interface LocationFilterConfig extends FilterConfig<LocationFilterParams> {
  type: FILTER_TYPES.LOCATION;
  options: {
    maxDistance: number;
    minDistance: number;
  };
  hasContentPlaceholder: true;
}
