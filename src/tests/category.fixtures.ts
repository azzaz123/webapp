import { CategoryConsumerGoodsResponse, CategoryResponse } from '../app/core/category/category-response.interface';
import { IOption } from 'ng-select';

export const CATEGORY_DATA_WEB: Array<CategoryResponse> = [
  {
    'categoryId': 100,
    'countryCode': 'ES',
    'defaultTitle': 'Cars',
    'highlighted': false,
    'iconColor': 'hsl(200,90%,76%)',
    'iconName': 'category_Cars',
    'numPublishedItems': 0,
    'order': '50',
    'title': 'Coches',
    'url': '/list/coches',
    'visible': true
  },
  {
    'categoryId': 15245,
    'countryCode': 'ES',
    'defaultTitle': 'Electronics',
    'highlighted': false,
    'iconColor': 'hsl(200,90%,76%)',
    'iconName': 'category_Electronics',
    'numPublishedItems': 0,
    'order': '40',
    'title': 'Electrónica',
    'url': '/list/electronica',
    'visible': true
  }
];

export const CATEGORIES_DATA_CONSUMER_GOODS: CategoryConsumerGoodsResponse[] = [{
  'category_id': 12465,
  'name': 'Fashion & Accessories',
  'icon_id': 't-shirt',
  'vertical_id': 'consumer_goods'
}, {
  'category_id': 12467,
  'name': 'Home & Garden',
  'icon_id': 'furniture',
  'vertical_id': 'consumer_goods'
}, {
  'category_id': 12545,
  'name': 'Electronics',
  'icon_id': 'smartphone',
  'vertical_id': 'consumer_goods'
}];

export const CATEGORIES_OPTIONS: IOption[] = [{
  value: '12465',
  label: 'Fashion & Accessories'
}, {
  value: '12467',
  label: 'Home & Garden'
}, {
  value: '12545',
  label: 'Electronics'
}];
