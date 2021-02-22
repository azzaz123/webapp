import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { RangeFilterParams } from '@public/shared/components/filters/components/range-filter/interfaces/range-filter-params.interface';
import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-step-config.interface';

export interface RangeFilterConfig extends FilterConfig<RangeFilterParams> {
  range: [number, number];
  stepsConfig?: SliderFormStepConfig[];
  placeholder: string;
  units?: string;
  limitless?: boolean;
}
