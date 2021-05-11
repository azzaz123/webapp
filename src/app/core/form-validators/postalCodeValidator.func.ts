import { AbstractControl } from '@angular/forms';

const pattern: RegExp = /^[0-9]*$/;

export function postalCodeValidator(control: AbstractControl): { [key: string]: boolean } {
  if (control?.value?.length < 5) return;
  return pattern.test(control.value) ? null : { invalid: true };
}
