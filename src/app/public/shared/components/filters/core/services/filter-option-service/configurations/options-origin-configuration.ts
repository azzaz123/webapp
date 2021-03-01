import { OptionsApiOrigin } from './option-api-origin.interface';
import { REAL_ESTATE_CONFIGURATION_ID } from '../../../enums/configuration-ids/real-estate-configuration-ids.enum';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { CAR_CONFIGURATION_ID } from '../../../enums/configuration-ids/car-configuration-ids';
import { FASHION_CONFIGURATION_ID } from '../../../enums/configuration-ids/fashion-configuration-ids.enum';
import { ConfigurationId } from '../../../types/configuration-id.type';

export type OriginConfigurationValue = OptionsApiOrigin | 'hardcoded';
export type OriginConfiguration = {
  [key in ConfigurationId]?: OriginConfigurationValue;
};

export const OPTIONS_ORIGIN_CONFIGURATION: OriginConfiguration = {
  [COMMON_CONFIGURATION_ID.POSTED_AGO]: 'hardcoded',
  [COMMON_CONFIGURATION_ID.CONDITION]: {
    apiMethod: 'getConditionsByCategoryId',
    mapperMethod: 'formatConditionResponse',
    apiRelatedParamKeys: ['category_ids'],
  },
  [COMMON_CONFIGURATION_ID.OBJECT_TYPE]: {
    apiMethod: 'getObjectTypesByCategoryId',
    mapperMethod: 'formatObjectType',
    apiRelatedParamKeys: ['category_ids'],
  },
  [COMMON_CONFIGURATION_ID.BRAND_MODEL]: {
    apiMethod: 'getBrandModelByCategoryId',
    mapperMethod: 'formatBrandModel',
    apiRelatedParamKeys: ['category_ids'],
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
    apiRelatedParamKeys: ['operation'],
  },
  [REAL_ESTATE_CONFIGURATION_ID.CONDITION]: {
    apiMethod: 'getRealEstateConditions',
    mapperMethod: 'formatIconOptions',
  },
  [REAL_ESTATE_CONFIGURATION_ID.EXTRAS]: {
    apiMethod: 'getRealEstateExtraKeysByTypeId',
    mapperMethod: 'formatIconOptions',
    apiRelatedParamKeys: ['type'],
  },

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
    apiRelatedParamKeys: ['object_type_id'],
    mapperRelatedParamKeys: ['gender'],
  },
  [FASHION_CONFIGURATION_ID.BRAND]: {
    apiMethod: 'getFashionBrandsByObjectTypeId',
    mapperMethod: 'formatFashionBrand',
    apiRelatedParamKeys: ['object_type_id'],
  },
};
