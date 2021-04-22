import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateCalendar' })
export class DateCalendarPipe implements PipeTransform {
  public transform(value: Date, momentCalendarSpec: moment.CalendarSpec): string {
    return moment(value).calendar(null, momentCalendarSpec);
  }
}
