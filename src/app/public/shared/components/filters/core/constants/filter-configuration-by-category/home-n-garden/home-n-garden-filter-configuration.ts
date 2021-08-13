import { HOME_N_GARDEN_FILTER_ID } from '../../../enums/filter-ids/home-n-garden.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const HOME_N_GARDEN_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    HOME_N_GARDEN_FILTER_ID.CATEGORIES,
    HOME_N_GARDEN_FILTER_ID.PRICE,
    HOME_N_GARDEN_FILTER_ID.OBJECT_TYPE,
    HOME_N_GARDEN_FILTER_ID.CONDITION,
    HOME_N_GARDEN_FILTER_ID.LOCATION,
  ],
  drawer: [
    HOME_N_GARDEN_FILTER_ID.CATEGORIES,
    HOME_N_GARDEN_FILTER_ID.PRICE,
    HOME_N_GARDEN_FILTER_ID.OBJECT_TYPE,
    HOME_N_GARDEN_FILTER_ID.CONDITION,
    HOME_N_GARDEN_FILTER_ID.LOCATION,
    HOME_N_GARDEN_FILTER_ID.POSTED_AGO,
  ],
};
