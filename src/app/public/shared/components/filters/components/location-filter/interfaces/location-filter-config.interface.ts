import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { LocationFilterParams } from './location-filter-params.interface';
import { LocationFilterMapZoom } from './location-filter-map-zoom.interface';
import { SliderFormStepConfig } from '@shared/form/components/slider/interfaces/slider-form-step-config.interface';

export interface LocationFilterConfig extends FilterConfig<LocationFilterParams> {
  type: FILTER_TYPES.LOCATION;
  range: [number, number];
  stepsConfig: SliderFormStepConfig[];
  mapZoomValue: LocationFilterMapZoom[];
  units: string;
  limitless: true;
  hasContentPlaceholder: true;
}
