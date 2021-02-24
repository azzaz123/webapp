import { OptionsApiOrigin } from './option-api-origin.interface';
import { REAL_ESTATE_CONFIGURATION_ID } from '../../../enums/configuration-ids/real-estate-configuration-ids.enum';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { CAR_CONFIGURATION_ID } from '../../../enums/configuration-ids/car-configuration-ids';
import { FASHION_CONFIGURATION_ID } from '../../../enums/configuration-ids/fashion-configuration-ids.enum';

export const OPTIONS_ORIGIN_CONFIGURATION: Record<string, OptionsApiOrigin | 'hardcoded'> = {
  [COMMON_CONFIGURATION_ID.POSTED_AGO]: 'hardcoded',
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

  [CAR_CONFIGURATION_ID.SEATS]: 'hardcoded',
  [CAR_CONFIGURATION_ID.DOORS]: 'hardcoded',
  [CAR_CONFIGURATION_ID.BRAND_N_MODEL]: {
    apiMethod: 'getCarBrandsAndModels',
    mapperMethod: 'formatCarsBrandModel',
  },
  [CAR_CONFIGURATION_ID.BODY]: {
    apiMethod: 'getCarBodyTypeKeys',
    mapperMethod: 'formatIconOptions',
  },
  [CAR_CONFIGURATION_ID.ENGINE]: {
    apiMethod: 'getCarEngineKeys',
    mapperMethod: 'formatIconOptions',
  },
  [CAR_CONFIGURATION_ID.GEARBOX]: {
    apiMethod: 'getCarGearboxKeys',
    mapperMethod: 'formatIconOptions',
  },

  [FASHION_CONFIGURATION_ID.GENDER]: 'hardcoded',
  [FASHION_CONFIGURATION_ID.SIZE]: {
    apiMethod: 'getFashionSizeKeysByObjectId',
    mapperMethod: 'formatSizeNGender',
    paramsFromRelatedFilters: ['object_type_id'],
  },
  [FASHION_CONFIGURATION_ID.BRAND]: {
    apiMethod: 'getFashionBrandsByObjectTypeId',
    mapperMethod: 'formatFashionBrand',
    paramsFromRelatedFilters: ['object_type_id'],
  },
};
