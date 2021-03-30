import { AGRICULTURE_FILTER_ID } from '../../../enums/filter-ids/agriculture-n-industrial.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [AGRICULTURE_FILTER_ID.PRICE],
  drawer: [AGRICULTURE_FILTER_ID.PRICE],
};
