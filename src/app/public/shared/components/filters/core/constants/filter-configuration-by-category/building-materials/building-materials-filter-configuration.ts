import { BUILDING_MATERIALS_FILTER_ID } from '../../../enums/filter-ids/building-materials.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const BUILDING_MATERIALS_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [BUILDING_MATERIALS_FILTER_ID.PRICE],
  drawer: [BUILDING_MATERIALS_FILTER_ID.PRICE],
};
