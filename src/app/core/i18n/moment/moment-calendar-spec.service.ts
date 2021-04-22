import { Injectable } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { CalendarSpec } from 'moment';
import { allCalendarConfigs } from './constants';
import { defaultCalendarSpec as defaultEnglishCalendarSpec } from './constants/calendar-specs.en';
import { CALENDAR_SPEC_TYPE } from './enums/calendar-spec-type.enum';
import { CalendarSpecsConfigs } from './interfaces/calendar-specs.interface';

@Injectable({
  providedIn: 'root',
})
export class MomentCalendarSpecService {
  constructor(private i18nService: I18nService) {}

  public getCalendarSpec(type: CALENDAR_SPEC_TYPE = CALENDAR_SPEC_TYPE.DEFAULT): CalendarSpec {
    const localizedCalendarConfig: CalendarSpecsConfigs = allCalendarConfigs[this.i18nService.locale];
    return localizedCalendarConfig ? localizedCalendarConfig[type] : defaultEnglishCalendarSpec;
  }
}
