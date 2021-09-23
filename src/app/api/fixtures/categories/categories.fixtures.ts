import { CategoryDto } from '@api/categories/dtos';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CATEGORY_ICONS } from '@public/shared/components/filters/components/categories-filter/data/category_options';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';

export const categoriesFixture: CategoryDto[] = [
  {
    category_id: CATEGORY_IDS.CAR,
    name: 'Coches',
    icon_id: 'car',
    vertical_id: 'cars',
    fields: {},
    hasShipping: false,
    profile_slider: { text: 'Vendedores destacados', has_call_to_action: true },
    bump_slider: { has_call_to_action: true },
    bump_item_icon: 'default_icon',
    has_num_item_top_sellers: true,
  },
  {
    category_id: CATEGORY_IDS.MOTORBIKE,
    name: 'Motos',
    icon_id: 'motorbike',
    vertical_id: 'consumer_goods',
    fields: {},
    hasShipping: false,
    profile_slider: { text: 'Vendedores destacados', has_call_to_action: true },
    bump_slider: { has_call_to_action: true },
    bump_item_icon: 'default_icon',
    has_num_item_top_sellers: true,
  },
  {
    category_id: CATEGORY_IDS.MOTOR_ACCESSORIES,
    name: 'Motor y Accesorios',
    icon_id: 'helmet',
    vertical_id: 'consumer_goods',
    fields: { type_of_object: { title: 'Subcategoría', order: 0 }, type_of_object_level_2: { title: '¿Puedes especificar?', order: 1 } },
    hasShipping: true,
    profile_slider: { text: 'Vendedores destacados', has_call_to_action: true },
    bump_slider: { has_call_to_action: true },
    bump_item_icon: 'default_icon',
    has_num_item_top_sellers: true,
  },
  {
    category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
    name: 'Moda y Accesorios',
    icon_id: 't-shirt',
    vertical_id: 'consumer_goods',
    fields: {
      type_of_object: { title: 'Tipo de prenda', order: 0 },
      type_of_object_level_2: { title: '¿Puedes especificar?', order: 1 },
      brand: { title: 'Marca', order: 1 },
      size: { title: 'Talla', order: 3 },
      gender: { title: 'Género', order: 2 },
    },
    hasShipping: true,
    profile_slider: { text: 'Vendedores destacados', has_call_to_action: true },
    bump_slider: { has_call_to_action: true },
    bump_item_icon: 'default_icon',
    has_num_item_top_sellers: true,
  },
];

export const mappedUploadCategoriesFixture: CategoryResponse[] = [
  {
    category_id: CATEGORY_IDS.CAR,
    name: 'Coches',
    icon_id: 'car',
    vertical_id: 'cars',
    fields: {},
    hasShipping: false,
  },
  {
    category_id: CATEGORY_IDS.MOTORBIKE,
    name: 'Motos',
    icon_id: 'motorbike',
    vertical_id: 'consumer_goods',
    fields: {},
    hasShipping: false,
  },
  {
    category_id: CATEGORY_IDS.MOTOR_ACCESSORIES,
    name: 'Motor y Accesorios',
    icon_id: 'helmet',
    vertical_id: 'consumer_goods',
    fields: { type_of_object: { title: 'Subcategoría', order: 0 }, type_of_object_level_2: { title: '¿Puedes especificar?', order: 1 } },
    hasShipping: true,
  },
  {
    category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
    name: 'Moda y Accesorios',
    icon_id: 't-shirt',
    vertical_id: 'consumer_goods',
    fields: {
      type_of_object: { title: 'Tipo de prenda', order: 0 },
      type_of_object_level_2: { title: '¿Puedes especificar?', order: 1 },
      brand: { title: 'Marca', order: 1 },
      size: { title: 'Talla', order: 3 },
      gender: { title: 'Género', order: 2 },
    },
    hasShipping: true,
  },
];

export const mappedSearchCategoriesFixture: CategoriesFilterOption[] = [
  {
    value: CATEGORY_IDS.CAR.toString(),
    label: 'Coches',
    icon: CATEGORY_ICONS.find((categoryIcon) => categoryIcon.id === 'car'),
  },
  {
    value: CATEGORY_IDS.MOTORBIKE.toString(),
    label: 'Motos',
    icon: CATEGORY_ICONS.find((categoryIcon) => categoryIcon.id === 'motorbike'),
  },
  {
    value: CATEGORY_IDS.MOTOR_ACCESSORIES.toString(),
    label: 'Motor y Accesorios',
    icon: CATEGORY_ICONS.find((categoryIcon) => categoryIcon.id === 'helmet'),
  },
  {
    value: CATEGORY_IDS.FASHION_ACCESSORIES.toString(),
    label: 'Moda y Accesorios',
    icon: CATEGORY_ICONS.find((categoryIcon) => categoryIcon.id === 't-shirt'),
  },
];
