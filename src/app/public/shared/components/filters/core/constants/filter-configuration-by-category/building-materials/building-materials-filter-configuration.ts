import { BUILDING_MATERIALS_FILTER_ID } from '../../../enums/filter-ids/building-materials.enum';
import { BubbleDrawerConfiguration } from '../../../interfaces/bubble-drawer-configuration.interface';

export const BUILDING_MATERIALS_FILTER_CONFIGURATION: BubbleDrawerConfiguration = {
  bubble: [BUILDING_MATERIALS_FILTER_ID.CATEGORIES, BUILDING_MATERIALS_FILTER_ID.PRICE, BUILDING_MATERIALS_FILTER_ID.CONDITION],
  drawer: [
    BUILDING_MATERIALS_FILTER_ID.CATEGORIES,
    BUILDING_MATERIALS_FILTER_ID.PRICE,
    BUILDING_MATERIALS_FILTER_ID.CONDITION,
    BUILDING_MATERIALS_FILTER_ID.POSTED_AGO,
  ],
};
