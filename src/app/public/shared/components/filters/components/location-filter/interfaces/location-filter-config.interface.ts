import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { LocationFilterParams } from './location-filter-params.interface';
import { CustomStepDefinition } from '@angular-slider/ngx-slider';

export interface LocationFilterConfig extends FilterConfig<LocationFilterParams> {
  type: FILTER_TYPES.LOCATION;
  range: [number, number];
  stepsArray?: CustomStepDefinition[];
  units?: string;
  limitless?: boolean;
  hasContentPlaceholder: true;
}
