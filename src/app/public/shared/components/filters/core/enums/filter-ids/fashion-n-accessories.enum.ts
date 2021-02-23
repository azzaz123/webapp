import { COMMON_CONSUMER_GOODS_FILTERS, COMMON_FILTERS } from '@public/shared/components/filters/core/enums/filter-ids/common.enum';

export enum FASHION_FILTERS {
  PRICE = COMMON_CONSUMER_GOODS_FILTERS.PRICE,
  CONDITION = COMMON_FILTERS.CONDITION,
  GENDER = 'fashion-gender',
  CLOTHING_TYPE = 'fashion-clothing_type',
  BRAND = 'fashion-brand',
  SIZE = 'fashion-size',
  LOCATION = COMMON_FILTERS.LOCATION,
  POSTED_BEFORE = COMMON_FILTERS.LOCATION,
}
