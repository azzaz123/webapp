import { IOption } from 'app/dropdown/utils/option.interface';

export interface CategoryResponse {
  category_id: number;
  name: string;
  icon_id: string;
  vertical_id: string;
  fields: CategoryFields;
  hasShipping?: boolean;
}

export interface CategoryFields {
  type_of_object?: CategoryField;
  type_of_object_level_2?: CategoryField;
  brand?: CategoryField;
  model?: CategoryField;
  size?: CategoryField;
  gender?: CategoryField;
}

export interface CategoryField {
  order: number;
  title: string;
}

export interface CategoryOption extends IOption {
  icon_id: string;
}

export interface SuggestedCategory {
  category_id: number;
}
