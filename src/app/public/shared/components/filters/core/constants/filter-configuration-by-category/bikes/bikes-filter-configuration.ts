import { BIKES_FILTER_ID } from '../../../enums/filter-ids/bikes.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const BIKES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [BIKES_FILTER_ID.PRICE],
  drawer: [BIKES_FILTER_ID.PRICE],
};
