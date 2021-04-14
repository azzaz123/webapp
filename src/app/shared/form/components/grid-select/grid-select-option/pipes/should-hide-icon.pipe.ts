import { Pipe, PipeTransform } from '@angular/core';
import { ICON_STATUS } from '@shared/form/components/grid-select/grid-select-option/enums/icon-status.enum';

@Pipe({
  name: 'shouldHideIcon',
})
export class ShouldHideIconPipe implements PipeTransform {
  transform(currentStatus: ICON_STATUS, iconStatus: ICON_STATUS): boolean {
    return currentStatus !== iconStatus;
  }
}
