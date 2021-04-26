import { MOTORS_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/motors-n-accessories.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const MOTOR_N_ACCESSORIES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [MOTORS_N_ACCESSORIES_FILTER_ID.CATEGORIES, MOTORS_N_ACCESSORIES_FILTER_ID.PRICE, MOTORS_N_ACCESSORIES_FILTER_ID.CONDITION],
  drawer: [
    MOTORS_N_ACCESSORIES_FILTER_ID.CATEGORIES,
    MOTORS_N_ACCESSORIES_FILTER_ID.PRICE,
    MOTORS_N_ACCESSORIES_FILTER_ID.CONDITION,
    MOTORS_N_ACCESSORIES_FILTER_ID.POSTED_AGO,
  ],
};
