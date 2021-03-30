import { MOVIES_N_BOOKS_FILTER_ID } from '../../../enums/filter-ids/movies-n-books.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const MOVIES_N_BOOKS_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
  drawer: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
};
