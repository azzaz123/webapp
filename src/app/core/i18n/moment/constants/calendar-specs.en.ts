import { CalendarSpec } from 'moment';
import { CalendarSpecsConfigs } from '../interfaces/calendar-specs.interface';

export const defaultCalendarSpec: CalendarSpec = {
  lastDay: '[Yesterday]',
  sameDay: '[Today]',
  nextDay: 'dddd, D MMM',
  lastWeek: 'dddd, D MMM',
  nextWeek: 'dddd, D MMM',
  sameElse: 'dddd, D MMM',
};

export const daysCalendarConfig: CalendarSpec = {
  lastDay: '[Yesterday] - HH:mm',
  sameDay: '[Today] - HH:mm',
  nextDay: '[Tomorrow]',
  lastWeek: 'dddd - HH:mm',
  nextWeek: 'dddd',
  sameElse: 'MMM DD, YYYY',
};

export const enMomentCalendarSpecs: CalendarSpecsConfigs = {
  default: defaultCalendarSpec,
  days: daysCalendarConfig,
};
