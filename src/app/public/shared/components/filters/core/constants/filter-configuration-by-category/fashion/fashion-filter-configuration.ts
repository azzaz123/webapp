import { FASHION_FILTER_ID } from '../../../enums/filter-ids/fashion-n-accessories.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const FASHION_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [FASHION_FILTER_ID.PRICE],
  drawer: [FASHION_FILTER_ID.PRICE],
};
