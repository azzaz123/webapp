import { OptionsApiOrigin } from './option-api-origin.interface';
import { CAR_FILTERS } from '../../../enums/filter-ids/cars.enum';
import { FASHION_FILTERS } from '../../../enums/filter-ids/fashion-n-accessories.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/real-estate-configuration-ids.enum';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';

export const OPTIONS_ORIGIN_CONFIGURATION: Record<string, OptionsApiOrigin | 'hardcoded'> = {
  [COMMON_CONFIGURATION_ID.POSTED_BEFORE]: 'hardcoded',
  [COMMON_CONFIGURATION_ID.CONDITION]: {
    apiMethod: 'getConditionsByCategoryId',
    mapperMethod: 'formatConditionResponse',
    paramsFromRelatedFilters: ['category_ids'],
  },
  [COMMON_CONFIGURATION_ID.OBJECT_TYPE]: {
    apiMethod: 'getObjectTypesByCategoryId',
    mapperMethod: 'formatObjectType',
    paramsFromRelatedFilters: ['category_ids'],
  },
  [COMMON_CONFIGURATION_ID.BRAND_MODEL]: {
    apiMethod: 'getBrandModelByCategoryId',
    mapperMethod: 'formatBrandModel',
    paramsFromRelatedFilters: ['category_ids'],
  },

  [REAL_ESTATE_CONFIGURATION_ID.ROOMS]: 'hardcoded',
  [REAL_ESTATE_CONFIGURATION_ID.BATHROOMS]: 'hardcoded',
  [REAL_ESTATE_CONFIGURATION_ID.OPERATION]: {
    apiMethod: 'getRealEstateOperationKeys',
    mapperMethod: 'formatIconOptions',
  },
  [REAL_ESTATE_CONFIGURATION_ID.TYPE]: {
    apiMethod: 'getRealEstateTypeKeysByOperationId',
    mapperMethod: 'formatIconOptions',
    paramsFromRelatedFilters: ['operation'],
  },
  [REAL_ESTATE_CONFIGURATION_ID.CONDITION]: {
    apiMethod: 'getRealEstateConditions',
    mapperMethod: 'formatIconOptions',
  },
  [REAL_ESTATE_CONFIGURATION_ID.EXTRAS]: {
    apiMethod: 'getRealEstateExtraKeysByTypeId',
    mapperMethod: 'formatIconOptions',
    paramsFromRelatedFilters: ['type'],
  },

  [CAR_FILTERS.SEATS]: 'hardcoded',
  [CAR_FILTERS.DOORS]: 'hardcoded',
  [CAR_FILTERS.BRAND_N_MODEL]: {
    apiMethod: 'getCarBrandsAndModels',
    mapperMethod: 'formatCarsBrandModel',
  },
  [CAR_FILTERS.BODY]: {
    apiMethod: 'getCarBodyTypeKeys',
    mapperMethod: 'formatIconOptions',
  },
  [CAR_FILTERS.ENGINE]: {
    apiMethod: 'getCarEngineKeys',
    mapperMethod: 'formatIconOptions',
  },
  [CAR_FILTERS.GEARBOX]: {
    apiMethod: 'getCarGearboxKeys',
    mapperMethod: 'formatIconOptions',
  },

  [FASHION_FILTERS.GENDER]: 'hardcoded',
  [FASHION_FILTERS.SIZE]: {
    apiMethod: 'getFashionSizeKeysByObjectId',
    mapperMethod: 'formatSizeNGender',
    paramsFromRelatedFilters: ['object_type_id'],
  },
  [FASHION_FILTERS.BRAND]: {
    apiMethod: 'getFashionBrandsByObjectTypeId',
    mapperMethod: 'formatFashionBrand',
    paramsFromRelatedFilters: ['object_type_id'],
  },
};
