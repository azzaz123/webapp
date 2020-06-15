import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

import { DateCalendarPipe } from './date-calendar.pipe';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
const ELEVENTH_OF_JUNE_OF_2020_IN_MS = 1591867791429;

@Component({
  template: '{{timestamp | dateCalendar:momentConfig}}'
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
      declarations: [
        MockComponent,
        DateCalendarPipe
      ]
    });
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    component.momentConfig = {
      lastDay: '[Yesterday] - HH:mm',
      sameDay: '[Today] - HH:mm',
      nextDay: '[Tomorrow]',
      lastWeek: 'dddd - HH:mm',
      nextWeek: 'dddd',
      sameElse: 'MMM DD, YYYY'
    };

    spyOn(Date, 'now').and.returnValue(ELEVENTH_OF_JUNE_OF_2020_IN_MS);

    fixture.detectChanges();
  });

  it('should display "Yesterday - hours:minutes" when date is from yesterday', () => {
    let shownText: string;
    const yesterdayInMs = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS;

    component.timestamp = yesterdayInMs;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Yesterday - 11:29');
  });

  it('should display "Today - hours:minutes" when date is from today', () => {
    let shownText: string;
    component.timestamp = ELEVENTH_OF_JUNE_OF_2020_IN_MS;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Today - 11:29');
  });

  it('should display "Tomorrow" when date is from today', () => {
    let shownText: string;
    component.timestamp = ELEVENTH_OF_JUNE_OF_2020_IN_MS + ONE_DAY_IN_MS;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Tomorrow');
  });


  it('should display "Day - hours:minutes" when date was from last week', () => {
    let shownText: string;
    component.timestamp = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS * 5;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Saturday - 11:29');
  });

  it('should display "day" when date is from next week', () => {
    let shownText: string;
    component.timestamp = ELEVENTH_OF_JUNE_OF_2020_IN_MS + ONE_DAY_IN_MS * 5;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Tuesday');
  });

  it('should display "month name day number, year" when date is from same year', () => {
    let shownText: string;
    component.timestamp = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS * 60;

    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('Apr 12, 2020');
  });
});
