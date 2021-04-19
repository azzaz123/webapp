import { AGRICULTURE_FILTER_ID } from '../../../enums/filter-ids/agriculture-n-industrial.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const AGRICULTURE_N_INDUSTRIAL_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [AGRICULTURE_FILTER_ID.PRICE],
  drawer: [AGRICULTURE_FILTER_ID.PRICE],
};
