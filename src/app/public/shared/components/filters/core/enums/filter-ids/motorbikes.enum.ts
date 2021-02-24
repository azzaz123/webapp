import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/consumer-goods-configuration-ids.enum';

export enum MOTORBIKES_FILTERS {
  PRICE = COMMON_CONSUMER_GOODS_CONFIGURATION_ID.PRICE,
  LOCATION = COMMON_CONFIGURATION_ID.LOCATION,
  POSTED_BEFORE = COMMON_CONFIGURATION_ID.LOCATION,
}
