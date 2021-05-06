import { AbstractControl } from '@angular/forms';
import { DeliveryCountryISOCode } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

export function phoneNumberValidator(control: AbstractControl, countryISOCode: DeliveryCountryISOCode): { [key: string]: boolean } {
  return null;
}
