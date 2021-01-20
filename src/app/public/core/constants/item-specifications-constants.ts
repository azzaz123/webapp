import { CAR_SPECIFICATION_TYPE } from './item-specifications/cars-constants';
import {
  REAL_ESTATE_ICON,
  REAL_STATE_TYPE,
} from './item-specifications/realestate-constants';

export interface ICON_SPECIFICATION {
  label: string;
  icon: REAL_ESTATE_ICON;
  type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
}

export interface NUMERIC_SPECIFICATION {
  type: REAL_STATE_TYPE | CAR_SPECIFICATION_TYPE;
  label?: string;
  translations?: TRANSLATIONS_OPTIONS;
}

export interface TRANSLATIONS_OPTIONS {
  singular: string;
  plural: string;
}
