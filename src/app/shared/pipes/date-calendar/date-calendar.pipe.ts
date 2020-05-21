import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'amCalendar', pure: false })
export class CalendarPipe implements PipeTransform {
  transform(value: Date, args: any[]): any {
    return moment(value).calendar(null, args[0]);
  }
}
