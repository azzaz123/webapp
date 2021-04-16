import { COLLECTIBLES_N_ART_FILTER_ID } from '../../../enums/filter-ids/collectibles-n-art.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const COLLECTBLES_N_ART_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [COLLECTIBLES_N_ART_FILTER_ID.PRICE],
  drawer: [COLLECTIBLES_N_ART_FILTER_ID.PRICE],
};
