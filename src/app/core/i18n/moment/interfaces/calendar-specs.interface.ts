import { CalendarSpec } from 'moment';
import { CALENDAR_SPEC_TYPE } from '../enums/calendar-spec-type.enum';

export interface CalendarSpecsConfigs {
  [CALENDAR_SPEC_TYPE.DEFAULT]: CalendarSpec;
  [CALENDAR_SPEC_TYPE.DAYS]: CalendarSpec;
  [CALENDAR_SPEC_TYPE.SHORT]: CalendarSpec;
}

export interface AllCalendarSpecsConfig {
  en: CalendarSpecsConfigs;
  es: CalendarSpecsConfigs;
  it: CalendarSpecsConfigs;
}
