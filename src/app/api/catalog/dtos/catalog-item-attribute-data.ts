export enum CAR_ATTRIBUTE_TYPE {
  GEARBOX = 'gearbox',
  BODY_TYPE = 'body_type',
  SEATS = 'seats',
  DOORS = 'doors',
  ENGINE = 'engine',
  BRAND = 'brand',
  MODEL = 'model',
  YEAR = 'year',
  KM = 'km',
  HORSEPOWER = 'horsepower',
}

export enum REAL_ESTATE_ATTRIBUTE_TYPE {
  SURFACE = 'surface',
  ROOMS = 'rooms',
  BATHROOMS = 'bathrooms',
  TYPE = 'type',
  CONDITION = 'condition',
  OPERATION = 'operation',
  GARAGE = 'garage',
  POOL = 'pool',
  ELEVATOR = 'elevator',
  GARDEN = 'garden',
  TERRACE = 'terrace',
}

export type ATTRIBUTE_TYPE = CAR_ATTRIBUTE_TYPE | REAL_ESTATE_ATTRIBUTE_TYPE;

export type CatalogItemAttributes = Partial<Record<ATTRIBUTE_TYPE, CatalogItemAttributeData>>;

export interface CatalogItemAttributeData {
  value: string;
  title: string;
  text: string;
}
