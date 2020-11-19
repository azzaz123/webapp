import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateCalendar', pure: false })
export class DateCalendarPipe implements PipeTransform {
  transform(value: Date, momentCalendarSpec: moment.CalendarSpec): any {
    return moment(value).calendar(null, momentCalendarSpec);
  }
}
