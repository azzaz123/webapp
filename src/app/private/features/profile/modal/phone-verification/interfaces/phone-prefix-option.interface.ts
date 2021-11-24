import { IOption } from '@shared/dropdown/utils/option.interface';
import { CountryCode } from 'libphonenumber-js';
export interface PhonePrefixOption extends IOption {
  country_code: CountryCode;
}
