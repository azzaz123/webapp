import { MOTORBIKES_FILTER_ID } from '../../../enums/filter-ids/motorbikes.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const MOTORBIKES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [MOTORBIKES_FILTER_ID.CATEGORIES, MOTORBIKES_FILTER_ID.PRICE, MOTORBIKES_FILTER_ID.POSTED_AGO],
  drawer: [MOTORBIKES_FILTER_ID.CATEGORIES, MOTORBIKES_FILTER_ID.PRICE, MOTORBIKES_FILTER_ID.POSTED_AGO],
};
