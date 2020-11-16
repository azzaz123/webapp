import { AbstractControl } from '@angular/forms';

export function whitespaceValidator(
  control: AbstractControl
): { [key: string]: boolean } {
  const isEmpty =
    control.value && typeof control.value === 'string'
      ? control.value.trim() === ''
      : false;

  return !isEmpty ? null : { whitespace: true };
}
