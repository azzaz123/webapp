import { JOBS_FILTER_ID } from '../../../enums/filter-ids/jobs.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const JOBS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [JOBS_FILTER_ID.PRICE],
  drawer: [JOBS_FILTER_ID.PRICE],
};
