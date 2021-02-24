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
        return $localize`:@@Edited ${minutes} minutes ago:EditedMinutesAgo${minutes}`; // Menos de 24h
      } else {
        const hours = minutes / 60;
        if (hours < 24) {
          return $localize`:@@Edited ${hours} hours ago:EditedHoursAgo${minutes}`; // Menos de 24h
        } else {
          const days = hours / 24;
          if (days < 2) {
            // De 1 a 2 días
            return $localize`:@@Edited 1 day ago:EditedOneDayAgo`;
          } else if (days < 3) {
            // De 2 a 3 días
            return $localize`:@@Edited 2 days ago:EditedTwoDaysAgo`;
          } else if (days < 4) {
            // De 3 a 4 días
            return $localize`:@@Edited 3 days ago:EditedThreeDaysAgo`;
          } else if (days < 7) {
            // De 4 a 7 días
            return $localize`:@@Edited 1 week ago:EditedOneWeekAgo`;
          } else if (days < 14) {
            // De 7 a 14 días
            return $localize`:@@Edited less than 2 weeks ago:EditedMoreTwoWeeks`;
          } else if (days < 30) {
            // De 14 a 30 días
            return $localize`:@@Edited less than 1 month:EditedLessMonth`;
          } else {
            // Más de 30 días
            return $localize`:@@Edited more than a month:EditedMoreMonth`;
          }
        }
      }
    } else return $localize`:@@Edited more than a month:EditedMoreMonth`;
  }
}
