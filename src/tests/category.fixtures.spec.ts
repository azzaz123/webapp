import {
  CategoryConsumerGoodsResponse,
  CategoryOption,
  CategoryResponse
} from '../app/core/category/category-response.interface';

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
  },
  {
    'categoryId': 14000,
    'countryCode': 'ES',
    'defaultTitle': 'Motorbikes',
    'highlighted': false,
    'iconColor': 'hsl(200,90%,76%)',
    'iconName': 'category_Motorbike',
    'numPublishedItems': 0,
    'order': '40',
    'title': 'Motos',
    'url': '/list/motorbikes',
    'visible': true
  },
  {
    'categoryId': 12800,
    'countryCode': 'ES',
    'defaultTitle': 'Motor & Accessories',
    'highlighted': false,
    'iconColor': 'hsl(200,90%,76%)',
    'iconName': 'category_MotorAccessories',
    'numPublishedItems': 0,
    'order': '40',
    'title': 'Motor y Accesorios',
    'url': '/list/motor-accesorios',
    'visible': true
  }
];

export const CATEGORIES_DATA_CONSUMER_GOODS: CategoryConsumerGoodsResponse[] = [{
  'category_id': 12465,
  'name': 'Fashion & Accessories',
  'icon_id': 't-shirt',
  'vertical_id': 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
}, {
  'category_id': 12467,
  'name': 'Home & Garden',
  'icon_id': 'furniture',
  'vertical_id': 'consumer_goods',
  has_object_type: false,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
}, {
  'category_id': 12545,
  'name': 'Electronics',
  'icon_id': 'smartphone',
  'vertical_id': 'consumer_goods',
  has_object_type: true,
  has_brand: false,
  has_model: false,
  object_type_title: 'title'
},
{
  'category_id': 16000,
  'name': 'Phones',
  'icon_id': 'smartphone',
  'vertical_id': 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: true,
  object_type_title: 'title'
},
{
  'category_id': 13200,
  'name': 'Services',
  'icon_id': 'toolbox',
  'vertical_id': 'consumer_goods',
  has_object_type: true,
  has_brand: true,
  has_model: false,
  object_type_title: 'title'
}, {
  'category_id': 13000,
  'name': 'Real Estate',
  'icon_id': 'house',
  'vertical_id': 'consumer_goods',
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


