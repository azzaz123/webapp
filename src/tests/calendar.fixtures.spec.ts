import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDates } from '../app/catalog/checkout/checkout-pro/range-datepicker/calendar-dates.interface';

export const MOCK_DATE: NgbDateStruct = { year: 2018, month: 5, day: 8 };
export const MOCK_DATE2: NgbDateStruct = { year: 2018, month: 5, day: 24 };

export const MOCK_SELECTED_DATES: CalendarDates = {
    fromDate: MOCK_DATE,
    toDate: MOCK_DATE2,
    formattedFromDate: new Date(MOCK_DATE.year, MOCK_DATE.month - 1, MOCK_DATE.day).toLocaleDateString(),
    formattedToDate: new Date(MOCK_DATE.year, MOCK_DATE.month - 1, MOCK_DATE.day).toLocaleDateString(),
    numberOfDays: 16
};
