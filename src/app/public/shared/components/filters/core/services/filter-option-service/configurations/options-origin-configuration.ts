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
    apiConfiguration: {
      method: 'getConditionsByCategoryId',
      requiredSiblingParams: ['category_ids'],
      keyMappers: [
        {
          sourceParamKey: 'category_ids',
          destinationParamKey: 'category_id',
        },
      ],
    },
    mapperConfiguration: {
      method: 'formatConditionResponse',
    },
  },
  [COMMON_CONFIGURATION_ID.OBJECT_TYPE]: {
    apiConfiguration: {
      method: 'getObjectTypesByCategoryId',
      requiredSiblingParams: ['category_ids'],
      keyMappers: [
        {
          sourceParamKey: 'category_ids',
          destinationParamKey: 'category_id',
        },
      ],
    },
    mapperConfiguration: {
      method: 'formatObjectType',
    },
  },
  [COMMON_CONFIGURATION_ID.BRAND_MODEL]: {
    apiConfiguration: {
      method: 'getBrandModelByCategoryId',
      requiredSiblingParams: ['category_ids'],
      keyMappers: [
        {
          sourceParamKey: 'category_ids',
          destinationParamKey: 'category_id',
        },
      ],
    },
    mapperConfiguration: {
      method: 'formatBrandModel',
    },
  },

  [REAL_ESTATE_CONFIGURATION_ID.ROOMS]: 'hardcoded',
  [REAL_ESTATE_CONFIGURATION_ID.BATHROOMS]: 'hardcoded',
  [REAL_ESTATE_CONFIGURATION_ID.OPERATION]: {
    apiConfiguration: {
      method: 'getRealEstateOperationKeys',
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },
  [REAL_ESTATE_CONFIGURATION_ID.TYPE]: {
    apiConfiguration: {
      method: 'getRealEstateTypeKeysByOperationId',
      requiredSiblingParams: ['operation'],
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },
  [REAL_ESTATE_CONFIGURATION_ID.CONDITION]: {
    apiConfiguration: {
      method: 'getRealEstateConditions',
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },
  [REAL_ESTATE_CONFIGURATION_ID.EXTRAS]: {
    apiConfiguration: {
      method: 'getRealEstateExtraKeysByTypeId',
      requiredSiblingParams: ['operation'],
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },

  [CAR_CONFIGURATION_ID.BRAND_N_MODEL]: {
    apiConfiguration: {
      method: 'getCarBrandsAndModels',
      keyMappers: [
        {
          sourceParamKey: 'autocomplete',
          destinationParamKey: 'text',
        },
      ],
    },
    mapperConfiguration: {
      method: 'formatCarsBrandModel',
    },
  },
  [CAR_CONFIGURATION_ID.BODY]: {
    apiConfiguration: {
      method: 'getCarBodyTypeKeys',
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },
  [CAR_CONFIGURATION_ID.ENGINE]: {
    apiConfiguration: {
      method: 'getCarEngineKeys',
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },
  [CAR_CONFIGURATION_ID.GEARBOX]: {
    apiConfiguration: {
      method: 'getCarGearboxKeys',
    },
    mapperConfiguration: {
      method: 'formatIconOptions',
    },
  },

  [FASHION_CONFIGURATION_ID.GENDER]: 'hardcoded',
  [FASHION_CONFIGURATION_ID.SIZE]: {
    apiConfiguration: {
      method: 'getFashionSizeKeysByObjectId',
      requiredSiblingParams: ['object_type_id'],
    },
    mapperConfiguration: {
      method: 'formatSizeNGender',
      requiredSiblingParams: ['gender'],
    },
  },
  [FASHION_CONFIGURATION_ID.BRAND]: {
    apiConfiguration: {
      method: 'getFashionBrandsByObjectTypeId',
      requiredSiblingParams: ['object_type_id'],
    },
    mapperConfiguration: {
      method: 'formatFashionBrand',
    },
  },
};
