import { CalendarDates } from './calendar-dates';
import { MOCK_SELECTED_DATES } from '../../../../tests/calendar.fixtures.spec';

describe('CalendarDates', () => {
  let dates: CalendarDates;

  beforeEach(() => {
    dates = MOCK_SELECTED_DATES;
  });

  it('should set the user data through the constructor', () => {
    expect(dates.fromDate).toBe(MOCK_SELECTED_DATES.fromDate);
    expect(dates.toDate).toBe(MOCK_SELECTED_DATES.toDate);
    expect(dates.formattedFromDate).toBe(MOCK_SELECTED_DATES.formattedFromDate);
    expect(dates.formattedToDate).toBe(MOCK_SELECTED_DATES.formattedToDate);
    expect(dates.numberOfDays).toBe(MOCK_SELECTED_DATES.numberOfDays);
  });
});
