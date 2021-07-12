import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateLocalize',
})
export class DateLocalizePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private localeId: string) {}

  transform(value: Date | string | number, format?: string, timezone?: string): any {
    console.log('localeId::', this.localeId);
    const datePipe: DatePipe = new DatePipe(this.localeId);
    return datePipe.transform(value, format, timezone, this.localeId);
  }
}
