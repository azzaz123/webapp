import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { LocationFilterParams } from './location-filter-params.interface';
import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-step-config.interface';

export interface LocationFilterConfig extends FilterConfig<LocationFilterParams> {
  type: FILTER_TYPES.LOCATION;
  range: [number, number];
  stepsConfig?: SliderFormStepConfig[];
  units?: string;
  limitless?: boolean;
  hasContentPlaceholder: true;
}
