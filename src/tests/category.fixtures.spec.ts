import {
  CategoryResponse,
  CategoryOption,
} from '../app/core/category/category-response.interface';

export const CATEGORY_DATA_WEB: Array<CategoryResponse> = [
  {
    category_id: 100,
    has_brand: false,
    has_model: false,
    has_object_type: false,
    icon_id: 'car',
    name: 'Cars',
    vertical_id: 'cars'
  },
  {
    category_id: 15000,
    has_brand: false,
    has_model: false,
    has_object_type: false,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 15245,
    has_brand: false,
    has_model: false,
    has_object_type: false,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 14000,
    has_brand: false,
    has_model: false,
    has_object_type: false,
    icon_id: 'motorbike',
    name: 'Motorbikes',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 12800,
    has_brand: false,
    has_model: false,
    has_object_type: false,
    icon_id: 'helmet',
    name: 'Motor parts',
    vertical_id: 'consumer_goods'
  }
];

export const CATEGORIES_DATA_CONSUMER_GOODS: CategoryResponse[] = [{
  category_id: 12465,
  name: 'Fashion & Accessories',
  icon_id: 't-shirt',
  vertical_id: 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
}, {
  category_id: 12467,
  name: 'Home & Garden',
  icon_id: 'furniture',
  vertical_id: 'consumer_goods',
  has_object_type: false,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
}, {
  category_id: 12545,
  name: 'Electronics',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods',
  has_object_type: true,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
},
{
  category_id: 16000,
  name: 'Phones',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
},
{
  category_id: 13200,
  name: 'Services',
  icon_id: 'toolbox',
  vertical_id: 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: false,
  object_type_title: 'title'
}, {
  category_id: 13000,
  name: 'Real Estate',
  icon_id: 'house',
  vertical_id: 'consumer_goods',
  has_object_type: false,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
}];

export const CATEGORIES_OPTIONS_CONSUMER_GOODS: CategoryOption[] = [{
  value: '12465',
  label: 'Fashion & Accessories',
  icon_id: 't-shirt',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
}, {
  value: '12467',
  label: 'Home & Garden',
  icon_id: 'furniture',
  has_object_type: false,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
}, {
  value: '12545',
  label: 'Electronics',
  icon_id: 'smartphone',
  has_object_type: true,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
},
{
  value: '16000',
  label: 'Phones',
  icon_id: 'smartphone',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
}];

export const CATEGORIES_OPTIONS: CategoryOption[] = [
  ...CATEGORIES_OPTIONS_CONSUMER_GOODS, {
    value: '13200',
    label: 'Services',
    icon_id: 'toolbox',
    has_object_type: true,
    has_brand: true,
    has_model: false,
    object_type_title: 'title'
  }, {
    value: '13000',
    label: 'Real Estate',
    icon_id: 'house',
    has_object_type: false,
    has_brand: false,
    has_model: false,
    object_type_title: 'title'
  }];


