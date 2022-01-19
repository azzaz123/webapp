import { MultiSelectFilterParams } from './multi-select-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from '../enum/multi-select-filter-bubble-variant.enum';

export interface MultiSelectFilterConfig extends AbstractSelectFilterConfig<MultiSelectFilterParams> {
  type: FILTER_TYPES.MULTISELECT;
  hasContentPlaceholder: true;
  bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT;
  singleBubbleValueLabel?: string;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  hasValueAsLabel?: boolean;
}
