import { GAMES_N_CONSOLES_FILTER_ID } from '../../../enums/filter-ids/games-n-consoles.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const GAMES_N_CONSOLES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
  drawer: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
};
