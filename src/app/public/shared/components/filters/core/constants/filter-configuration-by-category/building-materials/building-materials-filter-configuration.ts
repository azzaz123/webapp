import { BUILDING_MATERIALS_FILTER_ID } from '../../../enums/filter-ids/building-materials.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const BUILDING_MATERIALS_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [BUILDING_MATERIALS_FILTER_ID.PRICE],
  drawer: [BUILDING_MATERIALS_FILTER_ID.PRICE],
};
