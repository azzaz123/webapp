import { IOption } from 'ng-select';
export interface CategoryResponse {
  categoryId: number;
  countryCode: string;
  defaultTitle: string;
  highlighted: boolean;
  iconColor: string;
  iconName: string;
  numPublishedItems: number;
  order: string;
  title: string;
  url: string;
  visible: boolean;
}

export interface CategoryConsumerGoodsResponse {
  category_id: number;
  name: string;
  icon_id: string;
  vertical_id: string;
}

export interface CategoryOption extends IOption {
  icon_id: string;
}

