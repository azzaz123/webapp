import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';

export enum DEFAULT_FILTER_ID {
  PRICE = 'default-price',
  CONDITION = COMMON_CONFIGURATION_ID.CONDITION,
  LOCATION = COMMON_CONFIGURATION_ID.LOCATION,
  POSTED_BEFORE = COMMON_CONFIGURATION_ID.POSTED_BEFORE,
}
