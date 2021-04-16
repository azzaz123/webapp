import { HOME_N_GARDEN_FILTER_ID } from '../../../enums/filter-ids/home-n-garden.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const HOME_N_GARDEN_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [HOME_N_GARDEN_FILTER_ID.PRICE],
  drawer: [HOME_N_GARDEN_FILTER_ID.PRICE],
};
