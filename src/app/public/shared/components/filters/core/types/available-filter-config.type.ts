import { RangeFilterConfig } from '../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { CategoriesFilterConfig } from '../../components/categories-filter/interfaces/categories-filter-config.interface';
import { SuggesterFilterConfig } from '../../components/suggester-filter/interfaces/suggester-filter-config.interface';
import { GridSelectFilterConfig } from '../../components/grid-select-filter/interfaces/grid-select-filter-config.interface';

export type AvailableFilterConfig =
  | RangeFilterConfig
  | ToggleFilterConfig
  | CategoriesFilterConfig
  | SuggesterFilterConfig
  | GridSelectFilterConfig;
