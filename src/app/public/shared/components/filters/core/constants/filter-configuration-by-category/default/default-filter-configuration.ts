import { DEFAULT_FILTER_ID } from '../../../enums/filter-ids/default.enum';
import { FilterWrapperConfiguration } from '@public/shared/components/filters/core/interfaces/filter-wrapper-configuration.interface';

export const DEFAULT_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [DEFAULT_FILTER_ID.CATEGORIES, DEFAULT_FILTER_ID.PRICE, DEFAULT_FILTER_ID.CONDITION, DEFAULT_FILTER_ID.POSTED_AGO],
  drawer: [DEFAULT_FILTER_ID.CATEGORIES, DEFAULT_FILTER_ID.PRICE, DEFAULT_FILTER_ID.CONDITION, DEFAULT_FILTER_ID.POSTED_AGO],
};
