import { DEFAULT_FILTER_ID } from '../../../enums/filter-ids/default.enum';
import { BubbleDrawerConfiguration } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';

export const DEFAULT_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [DEFAULT_FILTER_ID.CATEGORIES, DEFAULT_FILTER_ID.PRICE, DEFAULT_FILTER_ID.CONDITION, DEFAULT_FILTER_ID.POSTED_AGO],
  drawer: [DEFAULT_FILTER_ID.CATEGORIES, DEFAULT_FILTER_ID.PRICE, DEFAULT_FILTER_ID.CONDITION, DEFAULT_FILTER_ID.POSTED_AGO],
};
