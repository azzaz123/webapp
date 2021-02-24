import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';

export enum CAR_FILTERS {
  PRICE = 'cars-price',
  BRAND_N_MODEL = 'cars-brand-n-model',
  YEAR = 'cars-year',
  KM = 'cars-km',
  LOCATION = COMMON_CONFIGURATION_ID.LOCATION,
  BODY = 'cars-body',
  ENGINE = 'cars-engine',
  GEARBOX = 'cars-gearbox',
  WARRANTY = 'cars-warranty',
  SEATS = 'cars-seats',
  DOORS = 'cars-doors',
  HORSE_POWER = 'cars-horse-power',
  PROFESSIONAL = 'cars-professional',
  POSTED_BEFORE = COMMON_CONFIGURATION_ID.POSTED_BEFORE,
}
