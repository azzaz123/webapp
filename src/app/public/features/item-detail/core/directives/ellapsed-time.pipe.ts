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
        return $localize`:@@EditedMinutesAgo:Edited ${Math.trunc(minutes)}:INTERPOLATION: minutes ago`;
      }
      if (hours < 24) {
        return $localize`:@@EditedHoursAgo:Edited ${Math.trunc(hours)}:INTERPOLATION: hours ago`;
      }
      const days = hours / 24;
      if (days < 2) {
        return $localize`:@@EditedOneDayAgo:Edited 1 day ago`;
      }
      if (days < 3) {
        return $localize`:@@EditedTwoDaysAgo:Edited 2 days ago`;
      }
      if (days < 4) {
        return $localize`:@@EditedThreeDaysAgo:Edited 3 days ago`;
      }
      if (days < 7) {
        return $localize`:@@EditedOneWeekAgo:Edited 1 week ago`;
      }
      if (days < 14) {
        return $localize`:@@EditedMoreTwoWeeks:Edited less than 2 weeks ago`;
      }
      if (days < 30) {
        return $localize`:@@EditedLessMonth:Edited less than 1 month`;
      }
      return $localize`:@@EditedMoreMonth:Edited more than a month`;
    }
    return $localize`:@@EditedMoreMonth:Edited more than a month`;
  }
}
