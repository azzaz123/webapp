import { CalendarSpec } from 'moment';
import { CalendarSpecsConfigs } from '../interfaces/calendar-specs.interface';

export const defaultCalendarSpec: CalendarSpec = {
  lastDay: '[Ayer]',
  sameDay: '[Hoy]',
  nextDay: 'dddd, D MMM',
  lastWeek: 'dddd, D MMM',
  nextWeek: 'dddd, D MMM',
  sameElse: 'dddd, D MMM',
};

export const daysCalendarConfig: CalendarSpec = {
  lastDay: '[Ayer] - HH:mm',
  sameDay: '[Hoy] - HH:mm',
  nextDay: '[Mañana]',
  lastWeek: 'dddd - HH:mm',
  nextWeek: 'dddd',
  sameElse: 'MMM DD, YYYY',
};

export const shortCalendarConfig: CalendarSpec = {
  lastDay: '[Ayer]',
  sameDay: 'HH:mm',
  nextDay: 'ddd',
  lastWeek: 'D MMM.',
  nextWeek: 'ddd',
  sameElse: 'D MMM.',
};

export const esMomentCalendarSpecs: CalendarSpecsConfigs = {
  default: defaultCalendarSpec,
  days: daysCalendarConfig,
  short: shortCalendarConfig,
};
