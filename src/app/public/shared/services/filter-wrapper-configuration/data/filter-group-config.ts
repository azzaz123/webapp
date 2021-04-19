import { FilterGroupConfig } from '../interfaces/filter-group-config.interface';
import { DEFAULT_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/default/default-filter-configuration';
import { CAR_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/car/car-filter-configuration';
import { FILTER_QUERY_PARAM_KEY } from '../../../components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { REAL_ESTATE_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/real-estate/real-estate-filter-configuration';
import { MOTORBIKES_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/motorbikes/motorbikes-filter-configuration';
import { FASHION_N_ACCESSORIES_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/fashion-n-accesories/fashion-n-accesories-filter-configuration';
import {
  REAL_ESTATE_RENT_BOX_ROOM_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_DEFAULT_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_FLAT_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_GARAGE_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_HOUSE_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_LAND_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_OFFICE_FILTER_CONFIGURATION,
  REAL_ESTATE_RENT_ROOM_FILTER_CONFIGURATION,
} from '../../../components/filters/core/constants/filter-configuration-by-category/real-estate/real-estate-rent-filter-configuration';
import {
  REAL_ESTATE_BUY_BOX_ROOM_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_DEFAULT_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_FLAT_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_GARAGE_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_HOUSE_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_LAND_FILTER_CONFIGURATION,
  REAL_ESTATE_BUY_OFFICE_FILTER_CONFIGURATION,
} from '../../../components/filters/core/constants/filter-configuration-by-category/real-estate/real-estate-buy-filter-configuration';

export const FILTER_GROUP_CONFIG: FilterGroupConfig[] = [
  {
    config: DEFAULT_FILTER_CONFIGURATION,
    params: [],
  },

  {
    config: CAR_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.CAR.toString(),
      },
    ],
  },

  {
    config: MOTORBIKES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.MOTORBIKE.toString(),
      },
    ],
  },

  {
    config: FASHION_N_ACCESSORIES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.FASHION_ACCESSORIES.toString(),
      },
    ],
  },

  {
    config: REAL_ESTATE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
    ],
  },

  {
    config: REAL_ESTATE_RENT_DEFAULT_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_HOUSE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'house',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_FLAT_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'apartment',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_ROOM_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'room',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_OFFICE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'office',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_GARAGE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'garage',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_LAND_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'land',
      },
    ],
  },
  {
    config: REAL_ESTATE_RENT_BOX_ROOM_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'rent',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'box_room',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_DEFAULT_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_HOUSE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'house',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_FLAT_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'apartment',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_OFFICE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'office',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_GARAGE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'garage',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_LAND_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'land',
      },
    ],
  },
  {
    config: REAL_ESTATE_BUY_BOX_ROOM_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.operation,
        value: 'buy',
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'box_room',
      },
    ],
  },
];
