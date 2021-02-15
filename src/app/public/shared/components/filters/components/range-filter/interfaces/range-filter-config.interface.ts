import { SliderFormStepsConfig } from '@shared/form/components/slider/interfaces/slider-form-steps-config.interface';

export interface RangeFilterConfig {
  range: [number, number];
  stepsConfig?: SliderFormStepsConfig;
  units?: string;
  limitless?: boolean;
}
