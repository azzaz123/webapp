import { Pipe, PipeTransform } from '@angular/core';
import { ERROR_BOX_EXIT_TYPE } from '@shared/error-box/interfaces/error-box-exit-type';

@Pipe({
  name: 'errorBoxBtnClassName',
})
export class ErrorBoxBtnClassNamePipe implements PipeTransform {
  transform(type: ERROR_BOX_EXIT_TYPE): string {
    if (type === ERROR_BOX_EXIT_TYPE.BUTTON) {
      return 'btn-primary';
    }
    if (type === ERROR_BOX_EXIT_TYPE.LINK) {
      return 'basic';
    }
  }
}
