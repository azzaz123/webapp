import { JOBS_FILTER_ID } from '../../../enums/filter-ids/jobs.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const JOBS_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [JOBS_FILTER_ID.PRICE],
  drawer: [JOBS_FILTER_ID.PRICE],
};
