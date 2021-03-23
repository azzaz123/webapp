import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_ESTATE_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { CounterSpecifications } from '@public/features/item-detail/components/item-specifications/interfaces/item.specifications.interface';

export const MOCK_MAP_SPECIFICATIONS_CAR: Car = new Car(
  '3',
  '3',
  'Car',
  'Description',
  90,
  'euros',
  343535355,
  'url',
  null,
  null,
  null,
  'webSlug',
  'brand',
  'model',
  2009,
  'manual',
  'gasoil',
  'red',
  200,
  'small_car',
  3,
  null,
  false,
  4,
  'brand_new'
);

export const MOCK_MAP_SPECIFICATIONS_CAR_BODY_OTHERS: Car = new Car(
  '3',
  '3',
  'Car',
  'Description',
  90,
  'euros',
  343535355,
  'url',
  null,
  null,
  null,
  'webSlug',
  'brand',
  'model',
  2009,
  'manual',
  'gasoil',
  'red',
  200,
  'others',
  3,
  null,
  false,
  4,
  'brand_new'
);

export const MOCK_COUNTER_SPECIFICATIONS_CAR: CounterSpecifications[] = [
  {
    type: CAR_SPECIFICATION_TYPE.SMALL,
  },
  {
    type: CAR_SPECIFICATION_TYPE.SEATS,
    label: MOCK_MAP_SPECIFICATIONS_CAR.numSeats.toString(),
  },
  {
    type: CAR_SPECIFICATION_TYPE.THREE_DOORS,
    label: MOCK_MAP_SPECIFICATIONS_CAR.numDoors.toString(),
  },
  {
    type: CAR_SPECIFICATION_TYPE.GASOIL,
  },
  {
    type: CAR_SPECIFICATION_TYPE.HORSEPOWER,
    label: MOCK_MAP_SPECIFICATIONS_CAR.horsepower + ' cv',
  },
  {
    type: CAR_SPECIFICATION_TYPE.MANUAL,
  },
  {
    type: CAR_SPECIFICATION_TYPE.CONDITION_0,
  },
];

export const MOCK_MAP_SPECIFICATIONS_REAL_ESTATE: Realestate = new Realestate(
  '3',
  '3',
  'House',
  'Description',
  null,
  4000,
  null,
  null,
  'URL',
  null,
  null,
  'webSlug',
  null,
  'apartment',
  'new_construction',
  3000,
  3,
  3,
  true,
  true,
  true,
  true,
  true
);

export const MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE: CounterSpecifications[] = [
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.FLAT,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.SURFACE,
    counter: MOCK_MAP_SPECIFICATIONS_REAL_ESTATE.surface,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.ROOMS,
    counter: MOCK_MAP_SPECIFICATIONS_REAL_ESTATE.rooms,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.BATHROOMS,
    counter: MOCK_MAP_SPECIFICATIONS_REAL_ESTATE.bathrooms,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.NEW_BUILD,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.GARAGE,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.ELEVATOR,
  },
  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.GARDEN,
  },

  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.POOL,
  },

  {
    type: REAL_ESTATE_SPECIFICATION_TYPE.TERRACE,
  },
];
