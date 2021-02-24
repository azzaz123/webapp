import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { CAR_CONFIGURATION_ID } from '../../../enums/configuration-ids/car-configuration-ids';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../../../enums/configuration-ids/consumer-goods-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '../../../enums/configuration-ids/fashion-configuration-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '../../../enums/configuration-ids/real-estate-configuration-ids.enum';
import { FilterOption } from '../../../interfaces/filter-option.interface';

type Configurations =
  | CAR_CONFIGURATION_ID
  | COMMON_CONFIGURATION_ID
  | COMMON_CONSUMER_GOODS_CONFIGURATION_ID
  | FASHION_CONFIGURATION_ID
  | REAL_ESTATE_CONFIGURATION_ID;

type HardcodedOptions = Record<Configurations, FilterOption[]>;

export const HARDCODED_OPTIONS: HardcodedOptions = {
  [COMMON_CONFIGURATION_ID.POSTED_AGO]: [],
  [REAL_ESTATE_CONFIGURATION_ID.ROOMS]: [],
  [REAL_ESTATE_CONFIGURATION_ID.BATHROOMS]: [],
  [CAR_CONFIGURATION_ID.SEATS]: [],
  [CAR_CONFIGURATION_ID.DOORS]: [],
  [FASHION_CONFIGURATION_ID.GENDER]: [],
};
