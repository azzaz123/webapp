import { PHONE_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/phones-n-accessories.enum';
import { FilterIdConfiguration } from '../../../interfaces/filter-id-configuration.interface';

export const PHONES_N_ACCESORIES_FILTER_CONFIGURATION: FilterIdConfiguration = {
  bubble: [PHONE_N_ACCESSORIES_FILTER_ID.PRICE],
  drawer: [PHONE_N_ACCESSORIES_FILTER_ID.PRICE],
};
