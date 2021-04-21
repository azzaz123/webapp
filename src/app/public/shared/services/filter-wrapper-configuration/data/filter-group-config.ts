import { FilterWrapperConfiguration } from '../interfaces/filter-group-config.interface';
import { DEFAULT_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/default/default-filter-configuration';
import { CAR_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/car/car-filter-configuration';
import { FILTER_QUERY_PARAM_KEY } from '../../../components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import {
  REAL_ESTATE_FILTER_CONFIGURATION,
  REAL_ESTATE_FLAT_FILTER_CONFIGURATION,
  REAL_ESTATE_HOUSE_FILTER_CONFIGURATION,
  REAL_ESTATE_ROOM_FILTER_CONFIGURATION,
  REAL_ESTATE_OFFICE_FILTER_CONFIGURATION,
  REAL_ESTATE_GARAGE_FILTER_CONFIGURATION,
  REAL_ESTATE_LAND_FILTER_CONFIGURATION,
  REAL_ESTATE_BOX_ROOM_FILTER_CONFIGURATION,
} from '../../../components/filters/core/constants/filter-configuration-by-category/real-estate/real-estate-filter-configuration';
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
import { FILTER_GROUP_ID } from '../enum/filter-group-id.enum';

export const DEFAULT_FILTER_WRAPPER_CONFIG: FilterWrapperConfiguration = {
  id: FILTER_GROUP_ID.DEFAULT,
  config: DEFAULT_FILTER_CONFIGURATION,
  params: [],
};

export const FILTER_WRAPPER_CONFIGS: FilterWrapperConfiguration[] = [
  {
    id: FILTER_GROUP_ID.CARS,
    config: CAR_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.CAR.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.MOTORBIKES,
    config: MOTORBIKES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.MOTORBIKE.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.FASHION,
    config: FASHION_N_ACCESSORIES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.FASHION_ACCESSORIES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.REAL_ESTATE_DEFAULT,
    config: REAL_ESTATE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_APARTMENT,
    config: REAL_ESTATE_FLAT_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'apartment',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_HOUSE,
    config: REAL_ESTATE_HOUSE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'house',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_ROOM,
    config: REAL_ESTATE_ROOM_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'room',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_OFFICE,
    config: REAL_ESTATE_OFFICE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'office',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_GARAGE,
    config: REAL_ESTATE_GARAGE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'garage',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_LAND,
    config: REAL_ESTATE_LAND_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'land',
      },
    ],
  },
  {
    id: FILTER_GROUP_ID.REAL_ESTATE_BOX_ROOM,
    config: REAL_ESTATE_BOX_ROOM_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: 'box_room',
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_DEFAULT,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_HOUSE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_APARTMENT,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_ROOM,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_OFFICE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_GARAGE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_LAND,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_RENT_BOX_ROOM,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_DEFAULT,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_HOUSE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_APARTMENT,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_OFFICE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_GARAGE,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_LAND,
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
    id: FILTER_GROUP_ID.REAL_ESTATE_BUY_BOX_ROOM,
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
  {
    id: FILTER_GROUP_ID.FASHION,
    config: FASHION_N_ACCESSORIES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.FASHION_ACCESSORIES.toString(),
      },
    ],
  },
];
