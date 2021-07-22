import { CalendarSpec } from 'moment';
import { CALENDAR_SPEC_TYPE } from '../enums/calendar-spec-type.enum';
import { CalendarSpecsConfigs } from '../interfaces/calendar-specs.interface';

export const defaultCalendarSpec: CalendarSpec = {
  lastDay: '[Leri]',
  sameDay: '[Oggi]',
  nextDay: 'dddd, D MMM',
  lastWeek: 'dddd, D MMM',
  nextWeek: 'dddd, D MMM',
  sameElse: 'dddd, D MMM',
};

export const daysCalendarConfig: CalendarSpec = {
  lastDay: '[Leri] - HH:mm',
  sameDay: '[Oggi] - HH:mm',
  nextDay: '[Mattina]',
  lastWeek: 'dddd - HH:mm',
  nextWeek: 'dddd',
  sameElse: 'MMM DD, YYYY',
};

export const shortCalendarConfig: CalendarSpec = {
  lastDay: '[Leri]',
  sameDay: 'HH:mm',
  nextDay: 'ddd',
  lastWeek: 'D MMM.',
  nextWeek: 'ddd',
  sameElse: 'D MMM.',
};

export const itMomentCalendarSpecs: CalendarSpecsConfigs = {
  [CALENDAR_SPEC_TYPE.DEFAULT]: defaultCalendarSpec,
  [CALENDAR_SPEC_TYPE.DAYS]: daysCalendarConfig,
  [CALENDAR_SPEC_TYPE.SHORT]: shortCalendarConfig,
};
