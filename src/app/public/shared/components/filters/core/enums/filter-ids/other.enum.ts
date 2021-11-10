import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/consumer-goods-configuration-ids.enum';

export enum OTHER_FILTER_ID {
  PRICE = COMMON_CONSUMER_GOODS_CONFIGURATION_ID.PRICE,
  CONDITION = COMMON_CONFIGURATION_ID.CONDITION,
  LOCATION = COMMON_CONFIGURATION_ID.LOCATION,
  POSTED_AGO = COMMON_CONFIGURATION_ID.POSTED_AGO,
  CATEGORIES = COMMON_CONFIGURATION_ID.CATEGORIES,
  OBJECT_TYPE = COMMON_CONSUMER_GOODS_CONFIGURATION_ID.OBJECT_TYPE,
}
