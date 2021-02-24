import { OptionsApiOrigin } from './option-api-origin.interface';
import { COMMON_FILTERS } from '../../../enums/filter-ids/common.enum';
import { CAR_FILTERS } from '../../../enums/filter-ids/cars.enum';
import { REAL_ESTATE_COMMON } from '../../../enums/filter-ids/real-estate/real-estate-common.enum';
import { FASHION_FILTERS } from '../../../enums/filter-ids/fashion-n-accessories.enum';

export const OPTIONS_ORIGIN_CONFIGURATION: Record<string, OptionsApiOrigin | 'hardcoded'> = {
  [COMMON_FILTERS.POSTED_BEFORE]: 'hardcoded',
  [COMMON_FILTERS.CONDITION]: {
    apiMethod: 'getConditionsByCategoryId',
    mapperMethod: 'formatConditionResponse',
    paramsFromRelatedFilters: ['category_ids'],
  },
  [COMMON_FILTERS.OBJECT_TYPE]: {
    apiMethod: 'getObjectTypesByCategoryId',
    mapperMethod: 'formatObjectType',
    paramsFromRelatedFilters: ['category_ids'],
  },
  [COMMON_FILTERS.BRAND_MODEL]: {
    apiMethod: 'getBrandModelByCategoryId',
    mapperMethod: 'formatBrandModel',
    paramsFromRelatedFilters: ['category_ids'],
  },

  [REAL_ESTATE_COMMON.ROOMS]: 'hardcoded',
  [REAL_ESTATE_COMMON.BATHROOMS]: 'hardcoded',
  [REAL_ESTATE_COMMON.OPERATION]: {
    apiMethod: 'getRealEstateOperationKeys',
    mapperMethod: 'formatIconOptions',
  },
  [REAL_ESTATE_COMMON.TYPE]: {
    apiMethod: 'getRealEstateTypeKeysByOperationId',
    mapperMethod: 'formatIconOptions',
    paramsFromRelatedFilters: ['operation'],
  },
  [REAL_ESTATE_COMMON.CONDITION]: {
    apiMethod: 'getRealEstateConditions',
    mapperMethod: 'formatIconOptions',
  },
  [REAL_ESTATE_COMMON.EXTRAS]: {
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
