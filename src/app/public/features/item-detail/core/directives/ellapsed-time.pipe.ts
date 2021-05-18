import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellapsedTime',
})
export class EllapsedTimePipe implements PipeTransform {
  transform(itemDate: number) {
    const currentTimestamp = Date.now();
    const ellapsedTimestamp = (currentTimestamp - itemDate) / 1000;

    if (ellapsedTimestamp > 0) {
      const minutes = ellapsedTimestamp / 60;
      const hours = minutes / 60;

      if (minutes < 60) {
        return $localize`:@@web_edited_minutes_ago:Edited ${Math.trunc(minutes)}:INTERPOLATION: minutes ago`;
      }
      if (hours < 24) {
        return $localize`:@@web_edited_hours_ago:Edited ${Math.trunc(hours)}:INTERPOLATION: hours ago`;
      }
      const days = hours / 24;
      if (days < 2) {
        return $localize`:@@web_edited_one_day_ago:Edited 1 day ago`;
      }
      if (days < 3) {
        return $localize`:@@web_edited_two_days_ago:Edited 2 days ago`;
      }
      if (days < 4) {
        return $localize`:@@web_edited_three_days_ago:Edited 3 days ago`;
      }
      if (days < 7) {
        return $localize`:@@web_edited_one_week_ago:Edited 1 week ago`;
      }
      if (days < 14) {
        return $localize`:@@web_edited_more_two_weeks:Edited less than 2 weeks ago`;
      }
      if (days < 30) {
        return $localize`:@@web_edited_less_month:Edited less than 1 month`;
      }
      return $localize`:@@web_edited_more_month:Edited more than a month`;
    }
    return $localize`:@@web_edited_more_month:Edited more than a month`;
  }
}
