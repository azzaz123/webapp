import { RangeFilterConfig } from '../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { CategoriesFilterConfig } from '../../components/categories-filter/interfaces/categories-filter-config.interface';
import { SuggesterFilterConfig } from '../../components/suggester-filter/interfaces/suggester-filter-config.interface';
import { GridSelectFilterConfig } from '../../components/grid-select-filter/interfaces/grid-select-filter-config.interface';
import { SelectFilterConfig } from '@public/shared/components/filters/components/select-filter/interfaces/select-filter-config.interface';
import { LocationFilterConfig } from '../../components/location-filter/interfaces/location-filter-config.interface';
import { MultiSelectFilterConfig } from '../../components/multi-select-filter/interfaces/multi-select-filter-config.interface';

export type AvailableFilterConfig =
  | RangeFilterConfig
  | ToggleFilterConfig
  | CategoriesFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | SuggesterFilterConfig
  | GridSelectFilterConfig
  | LocationFilterConfig;
