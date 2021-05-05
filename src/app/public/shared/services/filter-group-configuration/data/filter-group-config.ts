import { FilterGroupConfiguration } from '../interfaces/filter-group-config.interface';
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
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { PHONES_N_ACCESSORIES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/phones-n-accesories/phones-n-accesories-filter-configuration';
import { MOTOR_N_ACCESSORIES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/motors-n-accesories/motors-n-accesories-filter-configuration';
import { COMPUTERS_N_ELECTRONICS_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/computers-n-electronic/computers-n-electronic-filter-configuration';
import { SPORTS_N_LEISURE_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/sports-n-leisure/sports-n-leisure-filter-configuration';
import { BIKES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/bikes/bikes-filter-configuration';
import { GAMES_N_CONSOLES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/games-n-consoles/games-n-consoles-filter-configuration';
import { HOME_N_GARDEN_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/home-n-garden/home-n-garden-filter-configuration';
import { APPLIANCES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/appliances/appliances-filter-configuration';
import { MOVIES_N_BOOKS_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/movies-n-books/movies-n-books-filter-configuration';
import { BABY_N_CHILD_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/baby-n-child/baby-n-child-filter-configuration';
import { COLLECTIBLES_N_ART_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/collectibles-n-art/collectibles-n-art-filter-configuration';
import { BUILDING_MATERIALS_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/building-materials/building-materials-filter-configuration';
import { AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/agriculture-n-industrial/agriculture-n-industrial-filter-configuration';
import { JOBS_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/jobs/jobs-filter-configuration';
import { SERVICES_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/services/services-filter-configuration';
import { OTHER_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/other/other-filter-configuration';
import { AUDIO_N_PHOTO_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/audio-n-photo/audio-n-photo-filter-configuration';

export const DEFAULT_FILTER_GROUP_CONFIG: FilterGroupConfiguration = {
  id: FILTER_GROUP_ID.DEFAULT,
  config: DEFAULT_FILTER_CONFIGURATION,
  params: [],
};

export const FILTER_GROUP_CONFIGS: FilterGroupConfiguration[] = [
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
    id: FILTER_GROUP_ID.MOTOR_N_ACCESSORIES,
    config: MOTOR_N_ACCESSORIES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.MOTOR_ACCESSORIES.toString(),
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

  // TODO: Real state has too many configuration groups. We might be able to add some of this cases with future visibility flag instead

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
        value: REAL_ESTATE_SPECIFICATION_TYPE.FLAT,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.HOUSE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.ROOM,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.OFFICE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.GARAGE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.LAND,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BOX_ROOM,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.HOUSE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.FLAT,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.ROOM,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.OFFICE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.GARAGE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.LAND,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.RENT,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.BOX_ROOM,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.HOUSE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.FLAT,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.OFFICE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.GARAGE,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.LAND,
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
        value: REAL_ESTATE_SPECIFICATION_TYPE.BUY,
      },
      {
        key: FILTER_QUERY_PARAM_KEY.type,
        value: REAL_ESTATE_SPECIFICATION_TYPE.BOX_ROOM,
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.AUDIO_N_PHOTO,
    config: AUDIO_N_PHOTO_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.TV_AUDIO_CAMERAS.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.CELL_PHONES_ACCESSORIES,
    config: PHONES_N_ACCESSORIES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.CELL_PHONES_ACCESSORIES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.COMPUTERS_N_ELECTRONICS,
    config: COMPUTERS_N_ELECTRONICS_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.COMPUTERS_ELECTRONICS.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.SPORTS_N_LEISURE,
    config: SPORTS_N_LEISURE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.SPORTS_LEISURE.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.BIKES,
    config: BIKES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.BIKES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.GAMES_N_CONSOLES,
    config: GAMES_N_CONSOLES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.GAMES_CONSOLES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.HOME_N_GARDEN,
    config: HOME_N_GARDEN_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.HOME_GARDEN.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.APPLIANCES,
    config: APPLIANCES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.APPLIANCES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.MOVIES_N_BOOKS,
    config: MOVIES_N_BOOKS_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.GAMES_BOOKS.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.BABY_N_CHILD,
    config: BABY_N_CHILD_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.BABIES_CHILD.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.COLLECTIBLES_N_ART,
    config: COLLECTIBLES_N_ART_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.COLLECTIBLES_ART.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.BUILDING_MATERIALS,
    config: BUILDING_MATERIALS_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.CONSTRUCTION.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.AGRICULTURE_N_INDUSTRIAL,
    config: AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.AGRICULTURE_INDUSTRIAL.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.JOBS,
    config: JOBS_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.JOBS.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.SERVICES,
    config: SERVICES_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.SERVICES.toString(),
      },
    ],
  },

  {
    id: FILTER_GROUP_ID.OTHER,
    config: OTHER_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.OTHERS.toString(),
      },
    ],
  },
];
