import { AbstractControl } from '@angular/forms';
import { DeliveryCountryISOCode } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';

const spanishPostalCodeRegex: RegExp = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/;
// TODO: change regex		Date: 2021/05/06
const italianPostalCodeRegex: RegExp = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/;

export function postalCodeValidator(control: AbstractControl, currentCountrySelection: DeliveryCountryISOCode): { [key: string]: boolean } {
  return validatePostalCodeWithRegex(control.value, currentCountrySelection) ? null : { postal_code: true };
}

function validatePostalCodeWithRegex(postalCode: string, selectedCountry: DeliveryCountryISOCode): boolean {
  switch (selectedCountry) {
    case 'ES':
      return spanishPostalCodeRegex.test(postalCode);

    case 'IT':
      return italianPostalCodeRegex.test(postalCode);
  }
}
