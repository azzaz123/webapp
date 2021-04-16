import { AGRICULTURE_FILTER_ID } from '../../../enums/filter-ids/agriculture-n-industrial.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [AGRICULTURE_FILTER_ID.PRICE],
  drawer: [AGRICULTURE_FILTER_ID.PRICE],
};
