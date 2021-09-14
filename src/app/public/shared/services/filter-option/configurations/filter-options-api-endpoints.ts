export const FILTER_OPTIONS_API_ENDPOINTS = {
  CATEGORIES: '/categories/keys',
  CONDITION_BY_CATEGORY_ID: (categoryId: string) => {
    return categoryId ? `/consumer_goods/category/${categoryId}/keys/condition` : '/consumergoods/keys/condition';
  },
  OBJECT_TYPE: '/suggesters/general/object-type',
  BRAND_MODEL: '/suggesters/general/brand-model',
  CARS: {
    BRAND_MODEL: '/suggesters/cars/brands-and-models',
    BODY: '/cars/keys/bodytype',
    ENGINE: '/cars/keys/engine',
    GEARBOX: '/cars/keys/gearbox',
  },
  REAL_ESTATE: {
    CONDITIONS: '/real_estate/keys/condition',
    OPERATION: '/real_estate/keys/operation',
    TYPE: '/real_estate/keys/type',
    EXTRA: '/real_estate/keys/extra',
  },
  FASHION: {
    SIZE: '/fashion/keys/size',
    BRAND: '/suggesters/fashion/brand',
  },
};
