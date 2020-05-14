import {
  CategoryResponse,
  CategoryOption,
} from '../app/core/category/category-response.interface';

export const CATEGORY_DATA_WEB: Array<CategoryResponse> = [
  {
    category_id: 100,
    icon_id: 'car',
    name: 'Cars',
    vertical_id: 'cars'
  },
  {
    category_id: 15000,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 15245,
    icon_id: 'pc',
    name: 'Computers & Electronic',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 14000,
    icon_id: 'motorbike',
    name: 'Motorbikes',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 12800,
    icon_id: 'helmet',
    name: 'Motor parts',
    vertical_id: 'consumer_goods'
  },
  {
    category_id: 23000,
    icon_id: 'help',
    name: 'Help',
    vertical_id: 'consumer_goods'
  }
];

export const CATEGORIES_DATA_CONSUMER_GOODS: CategoryResponse[] = [{
  category_id: 12465,
  name: 'Fashion & Accessories',
  icon_id: 't-shirt',
  vertical_id: 'consumer_goods'
}, {
  category_id: 12467,
  name: 'Home & Garden',
  icon_id: 'furniture',
  vertical_id: 'consumer_goods'
}, {
  category_id: 12545,
  name: 'Electronics',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods'
},
{
  category_id: 16000,
  name: 'Phones',
  icon_id: 'smartphone',
  vertical_id: 'consumer_goods'
},
{
  category_id: 23000,
  name: 'Help',
  icon_id: 'help',
  vertical_id: 'consumer_goods'
},
{
  category_id: 13200,
  name: 'Services',
  icon_id: 'toolbox',
  vertical_id: 'consumer_goods'
}, {
  category_id: 13000,
  name: 'Real Estate',
  icon_id: 'house',
  vertical_id: 'consumer_goods'
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
}, {
  value: '23000',
  label: 'Help',
  icon_id: 'help'
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
