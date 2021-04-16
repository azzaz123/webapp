import { PHONE_N_ACCESSORIES_FILTER_ID } from '../../../enums/filter-ids/phones-n-accessories.enum';
import { FilterWrapperConfiguration } from '../../../interfaces/filter-wrapper-configuration.interface';

export const PHONES_N_ACCESORIES_FILTER_CONFIGURATION: FilterWrapperConfiguration = {
  bubble: [PHONE_N_ACCESSORIES_FILTER_ID.PRICE],
  drawer: [PHONE_N_ACCESSORIES_FILTER_ID.PRICE],
};
