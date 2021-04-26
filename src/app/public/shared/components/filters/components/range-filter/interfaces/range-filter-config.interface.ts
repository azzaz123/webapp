import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { RangeFilterParams } from '@public/shared/components/filters/components/range-filter/interfaces/range-filter-params.interface';
import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-step-config.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface RangeFilterConfig extends FilterConfig<RangeFilterParams> {
  type: FILTER_TYPES.RANGE;
  range: [number, number];
  stepsConfig?: SliderFormStepConfig[];
  units?: string;
  limitless?: boolean;
}
