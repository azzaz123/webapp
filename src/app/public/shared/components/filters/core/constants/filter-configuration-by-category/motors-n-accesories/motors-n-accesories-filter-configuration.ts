import { MOTORS_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/motors-n-accessories.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const MOTORS_N_ACCESSORIES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [MOTORS_N_ACCESSORIES_FILTER_ID.PRICE],
  drawer: [MOTORS_N_ACCESSORIES_FILTER_ID.PRICE],
};
