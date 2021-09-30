export interface CategoryDto {
  category_id: number;
  name: string;
  icon_id: string;
  vertical_id: string;
  fields: Partial<Record<CATEGORY_FIELD_NAME, CategoryFieldDto>>;
  hasShipping: boolean;
  profile_slider: {
    text: string;
    has_call_to_action: boolean;
  };
  bump_slider: {
    has_call_to_action: boolean;
  };
  bump_item_icon: string;
  has_num_item_top_sellers: boolean;
}

interface CategoryFieldDto {
  title: string;
  order: number;
}

enum CATEGORY_FIELD_NAME {
  TYPE_OF_OBJECT = 'type_of_object',
  TYPE_OF_OBJECT_LEVEL_2 = 'type_of_object_level_2',
  BRAND = 'brand',
  MODEL = 'model',
  SIZE = 'size',
  GENDER = 'gender',
}
