import { CAR_ICON } from '@public/shared/components/counter-specification/constants/car-icons-constants';
import { REAL_ESTATE_ICON } from '@public/shared/components/counter-specification/constants/realestate-icons-constants';
import { CAR_SPECIFICATION_TYPE } from './item-specifications/cars-constants';
import { REAL_STATE_TYPE } from './item-specifications/realestate-constants';

export interface ITEM_SPECIFICATION {
  type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  label?: LABEL;
  icon?: REAL_ESTATE_ICON | CAR_ICON;
}

export interface LABEL {
  singular: string;
  plural?: string;
}
