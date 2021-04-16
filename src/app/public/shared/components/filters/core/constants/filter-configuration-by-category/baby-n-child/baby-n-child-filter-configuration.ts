import { BABY_N_CHILD_FILTER_ID } from '../../../enums/filter-ids/baby-n-child.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const BABY_N_CHILD_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [BABY_N_CHILD_FILTER_ID.PRICE],
  drawer: [BABY_N_CHILD_FILTER_ID.PRICE],
};
