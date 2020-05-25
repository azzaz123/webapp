import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateUntilDay'
})
export class DateUntilDayPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const date = new Date();
    const newDate = date.setDate(date.getDate() + value);
    return super.transform(newDate);
  }

}
