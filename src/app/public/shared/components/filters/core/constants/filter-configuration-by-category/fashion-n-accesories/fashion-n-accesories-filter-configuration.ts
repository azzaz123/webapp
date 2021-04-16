import { FASHION_FILTER_ID } from '../../../enums/filter-ids/fashion-n-accessories.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const FASHION_N_ACCESSORIES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [FASHION_FILTER_ID.PRICE],
  drawer: [FASHION_FILTER_ID.PRICE],
};
