import { AUDIO_N_PHOTO_FILTER_ID } from '../../../enums/filter-ids/audio-n-photo.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const AUDIO_N_PHOTO_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [AUDIO_N_PHOTO_FILTER_ID.PRICE],
  drawer: [AUDIO_N_PHOTO_FILTER_ID.PRICE],
};
