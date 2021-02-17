import { environment } from '@environments/environment';

export enum FilterOptionApiEndpoints {
  BASE = `${environment.baseUrl}api/v3`,
  CONDITION = '/consumer_goods/category/{category_id}/keys/condition',
  OBJECT_TYPE = '/suggesters/general/object-type',
  BRAND_MODEL = '/suggesters/general/brand-model',
  CARS_BRAND_MODEL = '/suggesters/cars/brands-and-models',
  CARS_BODY = '/cars/keys/bodytype',
  CARS_ENGINE = '/cars/keys/engine',
  CARS_GEARBOX = '/cars/keys/gearbox',
  REAL_ESTATE_OPERATION_TYPE = '/real_estate/keys/operation',
  REAL_ESTATE_TYPE = '/real_estate/keys/type',
  REAL_ESTATE_EXTRA = '/real_estate/keys/extra',
  FASHION_SIZE = '/fashion/keys/size',
  FASHION_BRAND = '/suggesters/fashion/brand',
}
