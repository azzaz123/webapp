export const FilterOptionsApiEndpoints = {
  condition: (categoryId: string) => `/consumer_goods/category/${categoryId}/keys/condition`,
  objectType: '/suggesters/general/object-type',
  brandModel: '/suggesters/general/brand-model',
  cars: {
    brandModel: '/suggesters/cars/brands-and-models',
    body: '/cars/keys/bodytype',
    engine: '/cars/keys/engine',
    gearbox: '/cars/keys/gearbox',
  },
  realEstate: {
    conditions: '/real_estate/keys/condition',
    operation: '/real_estate/keys/operation',
    type: '/real_estate/keys/type',
    extra: '/real_estate/keys/extra',
  },
  fashion: {
    size: '/fashion/keys/size',
    brand: '/suggesters/fashion/brand',
  },
};
