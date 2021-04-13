import { COLLECTIBLES_N_ART_FILTER_ID } from '../../../enums/filter-ids/collectibles-n-art.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const COLLECTBLES_N_ART_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [COLLECTIBLES_N_ART_FILTER_ID.PRICE],
  drawer: [COLLECTIBLES_N_ART_FILTER_ID.PRICE],
};
