import { CalendarDates } from '../app/catalog-pro/checkout-pro/range-datepicker/calendar-dates';

export const MOCK_DATE = { year: 2018, month: 5, day: 8 };
export const MOCK_DATE2 = { year: 2018, month: 5, day: 24 };
export const MOCK_DATE3 = { year: 2018, month: 5, day: 25 };
export const MOCK_DATE4 = { year: 2020, month: 10, day: 20 };
export const MOCK_DATE5 = { year: 2020, month: 10, day: 28 };

export const MOCK_SELECTED_DATES: CalendarDates = new CalendarDates(
  MOCK_DATE,
  MOCK_DATE2
);

export const MOCK_SELECTED_DATES_TIMEZONE: CalendarDates = new CalendarDates(
  MOCK_DATE4,
  MOCK_DATE5
);
