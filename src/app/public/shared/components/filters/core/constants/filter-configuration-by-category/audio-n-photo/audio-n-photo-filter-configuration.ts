import { AUDIO_N_PHOTO_FILTER_ID } from '../../../enums/filter-ids/audio-n-photo.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const AUDIO_N_PHOTO_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [AUDIO_N_PHOTO_FILTER_ID.PRICE],
  drawer: [AUDIO_N_PHOTO_FILTER_ID.PRICE],
};
