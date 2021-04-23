import { MOTORBIKES_FILTER_ID } from '../../../enums/filter-ids/motorbikes.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const MOTORBIKES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [MOTORBIKES_FILTER_ID.PRICE],
  drawer: [MOTORBIKES_FILTER_ID.PRICE],
};
