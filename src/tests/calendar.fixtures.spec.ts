import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDates } from '../app/catalog/checkout/checkout-pro/range-datepicker/calendar-dates';

export const MOCK_DATE = { year: 2018, month: 5, day: 8 };
export const MOCK_DATE2 = { year: 2018, month: 5, day: 24 };
export const MOCK_DATE3 = { year: 2018, month: 5, day: 25 };

export const MOCK_SELECTED_DATES: CalendarDates = new CalendarDates(
    MOCK_DATE,
    MOCK_DATE2
);
