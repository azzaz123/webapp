import { MOTORS_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/motors-n-accessories.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const MOTORS_N_ACCESSORIES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [MOTORS_N_ACCESSORIES_FILTER_ID.PRICE],
  drawer: [MOTORS_N_ACCESSORIES_FILTER_ID.PRICE],
};
