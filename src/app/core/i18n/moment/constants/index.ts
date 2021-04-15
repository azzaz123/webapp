import { AllCalendarSpecsConfig } from '../interfaces/calendar-specs.interface';
import { enMomentCalendarSpecs } from './calendar-specs.en';
import { esMomentCalendarSpecs } from './calendar-specs.es';

export const allCalendarConfigs: AllCalendarSpecsConfig = {
  en: enMomentCalendarSpecs,
  es: esMomentCalendarSpecs,
};
