import { CAR_CONFIGURATION_ID } from '../enums/configuration-ids/car-configuration-ids.enum';
import { COMMON_CONFIGURATION_ID } from '../enums/configuration-ids/common-configuration-ids.enum';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../enums/configuration-ids/consumer-goods-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '../enums/configuration-ids/fashion-configuration-ids.enum';
import { PHONE_N_ACCESORIES_CONFIGURATION_ID } from '../enums/configuration-ids/phone-n-accessories-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '../enums/configuration-ids/real-estate-configuration-ids.enum';

export type ConfigurationId =
  | CAR_CONFIGURATION_ID
  | COMMON_CONFIGURATION_ID
  | COMMON_CONSUMER_GOODS_CONFIGURATION_ID
  | FASHION_CONFIGURATION_ID
  | PHONE_N_ACCESORIES_CONFIGURATION_ID
  | REAL_ESTATE_CONFIGURATION_ID;
