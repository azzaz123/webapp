import { APPLIANCES_FILTER_ID } from '../../../enums/filter-ids/appliances.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const APPLIANCES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [APPLIANCES_FILTER_ID.PRICE],
  drawer: [APPLIANCES_FILTER_ID.PRICE],
};
