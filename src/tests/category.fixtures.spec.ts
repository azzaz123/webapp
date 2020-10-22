import { CATEGORY_IDS } from 'app/core/category/category-ids';
import { CategoryResponse, CategoryOption, SuggestedCategory } from '../app/core/category/category-response.interface';

export const CATEGORY_DATA_WEB: Array<CategoryResponse> = [
  {
    category_id: 100,
    icon_id: 'car',
    name: 'Cars',
    vertical_id: 'cars',
    fields: {}
  },
  {
    category_id: 15000,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods',
    fields: {}
  },
  {
    category_id: 15245,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods',
    fields: {}
  },
  {
    category_id: 14000,
    icon_id: 'motorbike',
    name: 'Motorbikes',
    vertical_id: 'consumer_goods',
    fields: {}
  },
  {
    category_id: 12800,
    icon_id: 'helmet',
    name: 'Motor parts',
    vertical_id: 'consumer_goods',
    fields: {}
  }
];

export const CATEGORIES_DATA_CONSUMER_GOODS: CategoryResponse[] = [{
  category_id: 12465,
  name: 'Fashion & Accessories',
  icon_id: 't-shirt',
  vertical_id: 'consumer_goods',
  fields: {
    brand: { title: "Brand", order: 1 },
    gender: { title: "Gender", order: 2 },
    size: { title: "Size", order: 3 },
    type_of_object: { title: "Type of garment", order: 4 }
  }
}, {
  category_id: 12467,
  name: 'Home & Garden',
  icon_id: 'furniture',
  vertical_id: 'consumer_goods',
  fields: {}
}, {
  category_id: 12545,
  name: 'Electronics',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods',
  fields: {}
},
{
  category_id: 16000,
  name: 'Phones',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods',
  fields: {
    brand: { title: "Brand", order: 1 },
    model: { title: "Modelo", order: 2 },
    type_of_object: {
      title: "Type of product", order: 3
    }
  }
},
{
  category_id: 13200,
  name: 'Services',
  icon_id: 'toolbox',
  vertical_id: 'consumer_goods',
  fields: {}
}, {
  category_id: 13000,
  name: 'Real Estate',
  icon_id: 'house',
  vertical_id: 'consumer_goods',
  fields: {}
}];

export const CATEGORIES_OPTIONS_CONSUMER_GOODS: CategoryOption[] = [{
  value: '12465',
  label: 'Fashion & Accessories',
  icon_id: 't-shirt'
}, {
  value: '12467',
  label: 'Home & Garden',
  icon_id: 'furniture'
}, {
  value: '12545',
  label: 'Electronics',
  icon_id: 'smartphone'
}, {
  value: '16000',
  label: 'Phones',
  icon_id: 'smartphone'
},
{
  value: "13200",
  label: 'Services',
  icon_id: 'toolbox'
}, {
  value: "13000",
  label: 'Real Estate',
  icon_id: 'house',
}];

export const SUGGESTED_CATEGORIES: SuggestedCategory[] = [
  { category_id: CATEGORY_IDS.TV_AUDIO_CAMERAS },
  { category_id: CATEGORY_IDS.COMPUTERS_ELECTRONICS }
];

export const SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS: SuggestedCategory = {
  category_id: CATEGORY_IDS.TV_AUDIO_CAMERAS
};

export const SUGGESTED_CATEGORY_COMPUTERS_ELECTRONICS: SuggestedCategory = {
  category_id: CATEGORY_IDS.COMPUTERS_ELECTRONICS
};

