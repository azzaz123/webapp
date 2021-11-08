import { AUDIO_N_PHOTO_FILTER_ID } from '../../../enums/filter-ids/audio-n-photo.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const AUDIO_N_PHOTO_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [
    AUDIO_N_PHOTO_FILTER_ID.CATEGORIES,
    AUDIO_N_PHOTO_FILTER_ID.PRICE,
    AUDIO_N_PHOTO_FILTER_ID.OBJECT_TYPE,
    AUDIO_N_PHOTO_FILTER_ID.CONDITION,
    AUDIO_N_PHOTO_FILTER_ID.LOCATION,
  ],
  drawer: [
    AUDIO_N_PHOTO_FILTER_ID.CATEGORIES,
    AUDIO_N_PHOTO_FILTER_ID.PRICE,
    AUDIO_N_PHOTO_FILTER_ID.OBJECT_TYPE,
    AUDIO_N_PHOTO_FILTER_ID.CONDITION,
    AUDIO_N_PHOTO_FILTER_ID.LOCATION,
    AUDIO_N_PHOTO_FILTER_ID.POSTED_AGO,
  ],
};
