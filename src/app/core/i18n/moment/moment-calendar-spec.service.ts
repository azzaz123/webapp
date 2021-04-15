import { Injectable } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { allCalendarConfigs } from './constants';
import { CalendarSpecsConfigs } from './interfaces/calendar-specs.interface';

@Injectable({
  providedIn: 'root',
})
export class MomentCalendarSpecService {
  constructor(private i18nService: I18nService) {}

  public getCalendarSpec(): CalendarSpecsConfigs {
    return allCalendarConfigs[this.i18nService.locale];
  }
}
