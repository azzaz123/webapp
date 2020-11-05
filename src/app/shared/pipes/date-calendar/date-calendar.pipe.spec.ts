import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { DateCalendarPipe } from './date-calendar.pipe';
import * as moment from 'moment';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
const ELEVENTH_OF_JUNE_OF_2020_IN_MS = 1591867791429;

@Component({
  template: '{{timestamp | dateCalendar:momentConfig}}',
})
class MockComponent {
  public timestamp;
  public momentConfig;
}

describe('DateCalendarPipe', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, DateCalendarPipe],
    });
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    component.momentConfig = {
      lastDay: '[Yesterday] - HH:mm',
      sameDay: '[Today] - HH:mm',
      nextDay: '[Tomorrow]',
      lastWeek: 'dddd - HH:mm',
      nextWeek: 'dddd',
      sameElse: 'MMM DD, YYYY',
    };

    spyOn(Date, 'now').and.returnValue(ELEVENTH_OF_JUNE_OF_2020_IN_MS);

    fixture.detectChanges();
  });

  it('should display "Yesterday - hours:minutes" when date is from yesterday', () => {
    let shownText: string;
    const yesterdayInMs = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS;
    const momentDate = moment(yesterdayInMs);
    const expectedHours = momentDate.format('hh');
    const expectedMinutes = momentDate.format('mm');

    component.timestamp = yesterdayInMs;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe(`Yesterday - ${expectedHours}:${expectedMinutes}`);
  });

  it('should display "Today - hours:minutes" when date is from today', () => {
    let shownText: string;
    const todayInMs = ELEVENTH_OF_JUNE_OF_2020_IN_MS;
    const momentDate = moment(todayInMs);
    const expectedHours = momentDate.format('hh');
    const expectedMinutes = momentDate.format('mm');

    component.timestamp = todayInMs;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe(`Today - ${expectedHours}:${expectedMinutes}`);
  });

  it('should display "Tomorrow" when date is from today', () => {
    let shownText: string;
    const tomorrowInMs = ELEVENTH_OF_JUNE_OF_2020_IN_MS + ONE_DAY_IN_MS;

    component.timestamp = tomorrowInMs;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Tomorrow');
  });

  it('should display "Day - hours:minutes" when date was from last week', () => {
    let shownText: string;
    const pastSaturdayInMs = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS * 5;
    const momentDate = moment(pastSaturdayInMs);
    const expectedHours = momentDate.format('hh');
    const expectedMinutes = momentDate.format('mm');

    component.timestamp = pastSaturdayInMs;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe(`Saturday - ${expectedHours}:${expectedMinutes}`);
  });

  it('should display "day" when date is from next week', () => {
    let shownText: string;
    const nextTuesday = ELEVENTH_OF_JUNE_OF_2020_IN_MS + ONE_DAY_IN_MS * 5;

    component.timestamp = nextTuesday;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Tuesday');
  });

  it('should display "month name day number, year" when date is from same year', () => {
    let shownText: string;
    const pastTwelvethOfApril =
      ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS * 60;

    component.timestamp = pastTwelvethOfApril;
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Apr 12, 2020');
  });
});
