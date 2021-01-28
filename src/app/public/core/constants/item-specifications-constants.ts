import { CAR_ICON } from '@public/shared/components/counter-specification/constants/icons-car-constants';
import { REAL_ESTATE_ICON } from '@public/shared/components/counter-specification/constants/icons-realestate-constants';
import { CAR_SPECIFICATION_TYPE } from './item-specifications/cars-constants';
import { REAL_STATE_TYPE } from './item-specifications/realestate-constants';

export interface ItemSpecification {
  type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  label?: ItemSpecificationLabel;
  icon?: REAL_ESTATE_ICON | CAR_ICON;
}

export interface ItemSpecificationLabel {
  singular: string;
  plural?: string;
}
