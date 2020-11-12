import { AbstractControl } from '@angular/forms';
import { cloneDeep } from 'lodash-es';

export function whitespaceValidator(
  control: AbstractControl
): { [key: string]: boolean } {
  const isEmpty =
    control.value && typeof control.value === 'string'
      ? cloneDeep(control.value).replace(/\s+/g, '') === ''
      : false;

  return !isEmpty ? null : { whitespace: true };
}
