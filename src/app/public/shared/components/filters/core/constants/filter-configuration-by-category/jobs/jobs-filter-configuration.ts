import { JOBS_FILTER_ID } from '../../../enums/filter-ids/jobs.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const JOBS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [JOBS_FILTER_ID.CATEGORIES, JOBS_FILTER_ID.PRICE, JOBS_FILTER_ID.OBJECT_TYPE, JOBS_FILTER_ID.LOCATION],
  drawer: [JOBS_FILTER_ID.CATEGORIES, JOBS_FILTER_ID.PRICE, JOBS_FILTER_ID.OBJECT_TYPE, JOBS_FILTER_ID.LOCATION, JOBS_FILTER_ID.POSTED_AGO],
};
