import { GAMES_N_CONSOLES_FILTER_ID } from '../../../enums/filter-ids/games-n-consoles.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const GAMES_N_CONSOLES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    GAMES_N_CONSOLES_FILTER_ID.CATEGORIES,
    GAMES_N_CONSOLES_FILTER_ID.PRICE,
    GAMES_N_CONSOLES_FILTER_ID.CONDITION,
    GAMES_N_CONSOLES_FILTER_ID.LOCATION,
  ],
  drawer: [
    GAMES_N_CONSOLES_FILTER_ID.CATEGORIES,
    GAMES_N_CONSOLES_FILTER_ID.PRICE,
    GAMES_N_CONSOLES_FILTER_ID.CONDITION,
    GAMES_N_CONSOLES_FILTER_ID.LOCATION,
    GAMES_N_CONSOLES_FILTER_ID.POSTED_AGO,
  ],
};
