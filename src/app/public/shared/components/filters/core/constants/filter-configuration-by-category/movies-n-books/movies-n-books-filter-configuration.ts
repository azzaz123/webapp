import { MOVIES_N_BOOKS_FILTER_ID } from '../../../enums/filter-ids/movies-n-books.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const MOVIES_N_BOOKS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    MOVIES_N_BOOKS_FILTER_ID.CATEGORIES,
    MOVIES_N_BOOKS_FILTER_ID.PRICE,
    MOVIES_N_BOOKS_FILTER_ID.OBJECT_TYPE,
    MOVIES_N_BOOKS_FILTER_ID.CONDITION,
    MOVIES_N_BOOKS_FILTER_ID.LOCATION,
  ],
  drawer: [
    MOVIES_N_BOOKS_FILTER_ID.CATEGORIES,
    MOVIES_N_BOOKS_FILTER_ID.PRICE,
    MOVIES_N_BOOKS_FILTER_ID.OBJECT_TYPE,
    MOVIES_N_BOOKS_FILTER_ID.CONDITION,
    MOVIES_N_BOOKS_FILTER_ID.LOCATION,
    MOVIES_N_BOOKS_FILTER_ID.POSTED_AGO,
  ],
};
