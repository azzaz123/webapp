import { CategoryResponse } from '../app/core/category/category-response.interface';

export const CATEGORY_DATA_WEB: Array<CategoryResponse> =
  [
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
