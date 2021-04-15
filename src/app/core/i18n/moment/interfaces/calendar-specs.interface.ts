import { CalendarSpec } from 'moment';

export interface CalendarSpecsConfigs {
  default: CalendarSpec;
  days: CalendarSpec;
}

export interface AllCalendarSpecsConfig {
  en: CalendarSpecsConfigs;
  es: CalendarSpecsConfigs;
}
