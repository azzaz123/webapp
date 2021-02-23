import { REAL_ESTATE_COMMON } from '@public/shared/components/filters/core/enums/filter-ids/real-estate/real-estate-common.enum';
import { COMMON_FILTERS } from '@public/shared/components/filters/core/enums/filter-ids/common.enum';

export enum REAL_ESTATE_FILTERS {
  OPERATION = REAL_ESTATE_COMMON.OPERATION,
  TYPE = REAL_ESTATE_COMMON.TYPE,
  PRICE = 'real_estate-default-price',
  LOCATION = COMMON_FILTERS.LOCATION,
  CONDITION = REAL_ESTATE_COMMON.CONDITION,
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}
