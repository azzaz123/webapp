import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { APP_LOCALE } from 'configs/subdomains.config';
import { CalendarSpec } from 'moment';
import { allCalendarConfigs } from './constants';
import { defaultCalendarSpec as defaultEnglishCalendarSpec } from './constants/calendar-specs.en';
import { CALENDAR_SPEC_TYPE } from './enums/calendar-spec-type.enum';
import { CalendarSpecsConfigs } from './interfaces/calendar-specs.interface';

@Injectable({
  providedIn: 'root',
})
export class MomentCalendarSpecService {
  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE) {}

  public getCalendarSpec(type: CALENDAR_SPEC_TYPE = CALENDAR_SPEC_TYPE.DEFAULT): CalendarSpec {
    const localizedCalendarConfig: CalendarSpecsConfigs = allCalendarConfigs[this.locale];
    return localizedCalendarConfig ? localizedCalendarConfig[type] : defaultEnglishCalendarSpec;
  }
}
