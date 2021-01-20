import { CAR_TYPE_SPECIFICATION } from './counter-car-constants';
import { REAL_ESTATE_TYPE_SPECIFICATION } from './counter-realestate-constants';

export const COUNTER_TYPE = [
  ...REAL_ESTATE_TYPE_SPECIFICATION,
  ...CAR_TYPE_SPECIFICATION,
];
