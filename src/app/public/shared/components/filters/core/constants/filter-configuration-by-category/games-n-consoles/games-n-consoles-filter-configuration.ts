import { GAMES_N_CONSOLES_FILTER_ID } from '../../../enums/filter-ids/games-n-consoles.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const GAMES_N_CONSOLES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
  drawer: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
};
