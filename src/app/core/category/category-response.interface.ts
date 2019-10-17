import { IOption } from 'ng-select';

export interface CategoryResponse {
  category_id: number;
  name: string;
  icon_id: string;
  vertical_id: string;
  has_object_type: boolean;
  has_brand: boolean;
  has_model: boolean;
  object_type_title?: string;
}

export interface CategoryOption extends IOption {
  icon_id: string;
  has_object_type: boolean;
  has_brand: boolean;
  has_model: boolean;
  object_type_title: string;
}

