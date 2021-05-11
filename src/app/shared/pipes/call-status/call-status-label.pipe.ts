import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Pipe({
  name: 'callStatusLabel',
})
export class CallStatusLabelPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(callStatus: string = 'SHARED'): any {
    // TODO: Should be correctly typed after key cleanup
    return this.i18n.translate(callStatus.toLocaleLowerCase() as TRANSLATION_KEY);
  }
}
