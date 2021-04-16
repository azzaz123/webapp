import { MOVIES_N_BOOKS_FILTER_ID } from '../../../enums/filter-ids/movies-n-books.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const MOVIES_N_BOOKS_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
  drawer: [MOVIES_N_BOOKS_FILTER_ID.PRICE],
};
