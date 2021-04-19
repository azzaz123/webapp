import { GAMES_N_CONSOLES_FILTER_ID } from '../../../enums/filter-ids/games-n-consoles.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const GAMES_N_CONSOLES_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
  drawer: [GAMES_N_CONSOLES_FILTER_ID.PRICE],
};
