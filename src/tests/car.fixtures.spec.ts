import { map } from 'lodash-es';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Car } from '../app/core/item/car';
import { CAR_ID } from './upload.fixtures.spec';
import { CARS_CATEGORY } from '../app/core/item/item-categories';
import { CarContent, CarInfo } from '../app/core/item/item-response.interface';

export const CAR_BODY_TYPES_RESPONSE: any = [
  {
    id: 'small_car',
    icon_id: 'small_car',
    text: 'Small',
  },
  {
    id: 'coupe_cabrio',
    icon_id: 'coupe_cabrio',
    text: 'Coupe',
  },
  {
    id: 'sedan',
    icon_id: 'sedan',
    text: 'Sedan',
  },
  {
    id: 'family_car',
    icon_id: 'family_car',
    text: 'Family',
  },
  {
    id: 'mini_van',
    icon_id: 'mini_van',
    text: 'Mini Van',
  },
  {
    id: '4X4',
    icon_id: '4X4',
    text: '4X4',
  },
  {
    id: 'van',
    icon_id: 'van',
    text: 'Van',
  },
  {
    id: 'others',
    icon_id: 'others',
    text: 'Others',
  },
];

export const CAR_BODY_TYPES: any = [
  {
    value: 'small_car',
    label: 'Small',
    icon_id: 'assets/icons/small_car.svg',
  },
  {
    value: 'coupe_cabrio',
    label: 'Coupe',
    icon_id: 'assets/icons/coupe_cabrio.svg',
  },
  {
    value: 'sedan',
    label: 'Sedan',
    icon_id: 'assets/icons/sedan.svg',
  },
  {
    value: 'family_car',
    label: 'Family',
    icon_id: 'assets/icons/family_car.svg',
  },
  {
    value: 'mini_van',
    label: 'Mini Van',
    icon_id: 'assets/icons/mini_van.svg',
  },
  {
    value: '4X4',
    label: '4X4',
    icon_id: 'assets/icons/4X4.svg',
  },
  {
    value: 'van',
    label: 'Van',
    icon_id: 'assets/icons/van.svg',
  },
  {
    value: 'others',
    label: 'Others',
    icon_id: 'assets/icons/others.svg',
  },
];

export const CAR_BRANDS_RESPONSE: string[] = [
  'Abarth',
  'Alfa Romeo',
  'Aston Martin',
  'Audi',
  'Bentley',
  'BMW',
  'BYD',
  'Cadillac',
  'Caterham',
  'Chevrolet',
  'Chrysler',
  'Citroen',
  'Corvette',
  'Dacia',
  'Daewoo',
  'Daihatsu',
  'Dodge',
  'DS',
  'Faam',
  'Ferrari',
  'Fiat',
  'Ford',
  'Fornasari',
  'Galloper',
  'Honda',
  'Hummer',
  'Hyundai',
  'Infiniti',
  'Isuzu',
  'Iveco',
  'Jaguar',
  'Jeep',
  'KIA',
  'KTM',
  'Lada',
  'Lamborghini',
  'Lancia',
  'Land Rover',
  'LDV',
  'Lexus',
  'Lotus',
  'Mahindra',
  'Maserati',
  'Maybach',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  'MG',
  'Mini',
  'Mitsubishi',
  'Morgan',
  'Nissan',
  'Opel',
  'Peugeot',
  'Piaggio',
  'Porsche',
  'Renault',
  'Renault Trucks',
  'Rolls-Royce',
  'Rover',
  'Saab',
  'Santana',
  'SEAT',
  'Skoda',
  'smart',
  'SsangYong',
  'Subaru',
  'Suzuki',
  'Tata',
  'Tesla',
  'TH!NK',
  'Toyota',
  'VAZ',
  'Volkswagen',
  'Volvo',
  'Wiesmann',
];
export const CAR_BRANDS: IOption[] = toSelectOptions(CAR_BRANDS_RESPONSE);

export const CAR_YEARS_RESPONSE: number[] = [
  2017,
  2016,
  2015,
  2014,
  2013,
  2012,
  2011,
  2010,
  2009,
  2008,
];
export const CAR_YEARS: IOption[] = toSelectOptions(CAR_YEARS_RESPONSE);

export const CAR_MODELS_RESPONSE: string[] = [
  '124 Spider',
  '500',
  '695 Biposto',
];
export const CAR_MODELS: IOption[] = toSelectOptions(CAR_MODELS_RESPONSE);

export const CAR_VERSIONS_RESPONSE: string[] = [
  '1.4 MultiAir 170 2p',
  '1.4 MultiAir 170 2p Aut.',
];
export const CAR_VERSIONS: IOption[] = toSelectOptions(CAR_VERSIONS_RESPONSE);

function toSelectOptions(values: any[]): IOption[] {
  return map(values, (label: any) => ({
    value: label.toString(),
    label: label.toString(),
  }));
}

export const CAR_CONTENT_DATA = {
  id: CAR_ID,
  currency_code: 'EUR',
  seller_id: 'l1kmzn82zn3p',
  modified_date: 1429186498000,
  images: [],
  url: 'http://dock112.wallapop.com/i/514?_pid=wi&_uid=101',
  title: 'SEAT Ibiza 2015',
  brand: 'SEAT',
  model: 'Ibiza',
  year: 2015,
  sale_price: 10000.0,
  gearbox: 'manual',
  engine: 'gasoil',
  color: 'red',
  horsepower: 100.0,
  body_type: 'small_car',
  num_doors: 3,
  extras: [],
  storytelling: '',
  sale_conditions: {
    fix_price: false,
    exchange_allowed: false,
    shipping_allowed: false,
  },
  flags: {
    pending: false,
    sold: false,
    reserved: false,
    banned: false,
    expired: false,
  },
  warranty: false,
  num_seats: 9,
  condition: 'brand_new',
  web_slug: 'seat-ibiza-9-seats-514',
  version: 'version',
  financed_price: 10000.0,
  published_date: undefined,
  image: undefined,
  km: 1000,
};

export const CAR_DATA_FORM = {
  ...CAR_CONTENT_DATA,
  category_id: CARS_CATEGORY,
};

export const CAR_DATA = {
  id: CAR_ID,
  type: 'cars',
  content: CAR_CONTENT_DATA,
};

export const MOCK_CAR: Car = new Car(
  CAR_DATA.content.id,
  CAR_DATA.content.seller_id,
  CAR_DATA.content.title,
  CAR_DATA.content.storytelling,
  CAR_DATA.content.sale_price,
  CAR_DATA.content.currency_code,
  CAR_DATA.content.modified_date,
  CAR_DATA.content.url,
  CAR_DATA.content.flags,
  CAR_DATA.content.sale_conditions,
  CAR_DATA.content.images,
  CAR_DATA.content.web_slug,
  CAR_DATA.content.brand,
  CAR_DATA.content.model,
  CAR_DATA.content.year,
  CAR_DATA.content.gearbox,
  CAR_DATA.content.engine,
  CAR_DATA.content.color,
  CAR_DATA.content.horsepower,
  CAR_DATA.content.body_type,
  CAR_DATA.content.num_doors,
  CAR_DATA.content.extras,
  CAR_DATA.content.warranty,
  CAR_DATA.content.num_seats,
  CAR_DATA.content.condition,
  CAR_DATA.content.version,
  CAR_DATA.content.sale_price,
  undefined,
  undefined,
  CAR_DATA.content.km
);

export const CAR_INFO: CarInfo = {
  body_type: 'body_type',
  brand: 'brand',
  engine: 'engine',
  gearbox: 'gearbox',
  horsepower: 123,
  model: 'model',
  num_doors: 2,
  num_seats: 2,
  version: 'version',
};

export const MOCK_CAR_RESPONSE_CONTENT: CarContent = {
  id: MOCK_CAR.id,
  category_id: MOCK_CAR.categoryId,
  sale_price: MOCK_CAR.salePrice,
  title: MOCK_CAR.title,
  description: MOCK_CAR.description,
  modified_date: MOCK_CAR.modifiedDate,
  flags: MOCK_CAR.flags,
  seller_id: 'ukd73df',
  web_slug: MOCK_CAR.webSlug,
  brand: MOCK_CAR.brand,
  model: MOCK_CAR.model,
  body_type: MOCK_CAR.bodyType,
  km: MOCK_CAR.km,
  year: MOCK_CAR.year,
  engine: MOCK_CAR.engine,
  gearbox: MOCK_CAR.gearbox,
  horsepower: MOCK_CAR.horsepower,
  num_doors: MOCK_CAR.numDoors,
};
