import { Pipe, PipeTransform } from '@angular/core';
import { FormComplexIcon } from '@shared/form/interfaces/form-complex-icon.interface';

@Pipe({
  name: 'isComplexIcon',
})
export class IsComplexIconPipe implements PipeTransform {
  transform(icon: string | FormComplexIcon): boolean {
    return typeof icon !== 'string';
  }
}
