import { AbstractControl } from '@angular/forms';

const postalCodeRegex: RegExp = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/;

export function postalCodeValidator(control: AbstractControl): { [key: string]: boolean } {
  return postalCodeRegex.test(control.value) ? null : { postal_code: true };
}
