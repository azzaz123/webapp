import { MOVIES_N_BOOKS_FILTER_ID } from '../../../enums/filter-ids/movies-n-books.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const MOVIES_N_BOOKS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
  drawer: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
};
