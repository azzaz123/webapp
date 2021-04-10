import { CAR_FILTER_ID } from '../../../enums/filter-ids/cars.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';

export const TEST_CONFIG: FilterIdConfiguration = {
  bubble: [
    COMMON_CONFIGURATION_ID.CATEGORIES,
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.PROFESSIONAL,
    CAR_FILTER_ID.BODY,
    FASHION_CONFIGURATION_ID.GENDER,
  ],
  drawer: [
    COMMON_CONFIGURATION_ID.CATEGORIES,
    CAR_FILTER_ID.PRICE,
    CAR_FILTER_ID.PROFESSIONAL,
    CAR_FILTER_ID.BODY,
    FASHION_CONFIGURATION_ID.GENDER,
  ],
};
