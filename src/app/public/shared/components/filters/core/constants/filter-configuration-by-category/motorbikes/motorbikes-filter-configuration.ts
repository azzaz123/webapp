import { MOTORBIKES_FILTER_ID } from '../../../enums/filter-ids/motorbikes.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const MOTORBIKES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [MOTORBIKES_FILTER_ID.CATEGORIES, MOTORBIKES_FILTER_ID.PRICE],
  drawer: [MOTORBIKES_FILTER_ID.CATEGORIES, MOTORBIKES_FILTER_ID.PRICE, MOTORBIKES_FILTER_ID.POSTED_AGO],
};
