import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';

export const filterParametersMock: FilterParameter[] = [
  {
    key: FILTER_QUERY_PARAM_KEY.warranty,
    value: 'filterValue1',
  },
  {
    key: FILTER_QUERY_PARAM_KEY.professional,
    value: 'filterValue2',
  },
];

export const filterParametersMockWithCategory: FilterParameter[] = [
  {
    key: FILTER_QUERY_PARAM_KEY.warranty,
    value: 'filterValue1',
  },
  {
    key: FILTER_QUERY_PARAM_KEY.categoryId,
    value: `${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`,
  },
];
