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
      if (minutes < 60) {
        return $localize`:@@EditedMinutesAgo:Edited ${Math.trunc(minutes)}:INTERPOLATION: minutes ago`; // Menos de 1h
      } else {
        const hours = minutes / 60;
        if (hours < 24) {
          return $localize`:@@EditedHoursAgo:Edited ${Math.trunc(hours)}:INTERPOLATION: hours ago`; // Menos de 24h
        } else {
          const days = hours / 24;
          if (days < 2) {
            // De 1 a 2 días
            return $localize`:@@EditedOneDayAgo:Edited 1 day ago`;
          } else if (days < 3) {
            // De 2 a 3 días
            return $localize`:@@EditedTwoDaysAgo:Edited 2 days ago`;
          } else if (days < 4) {
            // De 3 a 4 días
            return $localize`:@@EditedThreeDaysAgo:Edited 3 days ago`;
          } else if (days < 7) {
            // De 4 a 7 días
            return $localize`:@@EditedOneWeekAgo:Edited 1 week ago`;
          } else if (days < 14) {
            // De 7 a 14 días
            return $localize`:@@EditedMoreTwoWeeks:Edited less than 2 weeks ago`;
          } else if (days < 30) {
            // De 14 a 30 días
            return $localize`:@@EditedLessMonth:Edited less than 1 month`;
          } else {
            // Más de 30 días
            return $localize`:@@EditedMoreMonth:Edited more than a month`;
          }
        }
      }
    } else return $localize`:@@EditedMoreMonth:Edited more than a month`;
  }
}
