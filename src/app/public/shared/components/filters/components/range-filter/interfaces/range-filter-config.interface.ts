import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-steps-config.interface';

export interface RangeFilterConfig {
  range: [number, number];
  stepsConfig?: SliderFormStepConfig[];
  placeholder: string;
  units?: string;
  limitless?: boolean;
}
