import { COMMON_FILTERS } from '@public/shared/components/filters/core/enums/filter-ids/common.enum';

export enum CAR_FILTERS {
  PRICE = 'cars-price',
  BRAND_N_MODEL = 'cars-brand-n-model',
  YEAR = 'cars-year',
  KM = 'cars-km',
  LOCATION = COMMON_FILTERS.LOCATION,
  BODY = 'cars-body',
  ENGINE = 'cars-engine',
  GEARBOX = 'cars-gearbox',
  WARRANTY = 'cars-warranty',
  SEATS = 'cars-seats',
  HORSE_POWER = 'cars-horse-power',
  PROFESSIONAL = 'cars-professional',
  POSTED_BEFORE = COMMON_FILTERS.POSTED_BEFORE,
}
