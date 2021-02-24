import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/consumer-goods-configuration-ids.enum';

export enum FASHION_FILTER_ID {
  PRICE = COMMON_CONSUMER_GOODS_CONFIGURATION_ID.PRICE,
  CONDITION = COMMON_CONFIGURATION_ID.CONDITION,
  GENDER = 'fashion-gender',
  CLOTHING_TYPE = COMMON_CONFIGURATION_ID.OBJECT_TYPE,
  BRAND = 'fashion-brand',
  SIZE = 'fashion-size',
  LOCATION = COMMON_CONFIGURATION_ID.LOCATION,
  POSTED_BEFORE = COMMON_CONFIGURATION_ID.LOCATION,
}
