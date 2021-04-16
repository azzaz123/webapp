import { JOBS_FILTER_ID } from '../../../enums/filter-ids/jobs.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const JOBS_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [JOBS_FILTER_ID.PRICE],
  drawer: [JOBS_FILTER_ID.PRICE],
};
