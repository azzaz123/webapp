import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EllapsedTimePipe } from './ellapsed-time.pipe';

const ONE_MINUTE_IN_MS = 1000 * 60;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
// Thu Jun 11 2020 11:29:51
const ELEVENTH_OF_JUNE_OF_2020_IN_MS = 1591867791429;

@Component({
  template: '{{date | ellapsedTime}}',
})
class TestComponent {
  public date: number;
}

describe('isCurrentUserPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [EllapsedTimePipe, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    spyOn(Date, 'now').and.returnValue(ELEVENTH_OF_JUNE_OF_2020_IN_MS);
  });

  it('when less than 1 hour has elapsed...', () => {
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_MINUTE_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedMinutesAgo:Edited ${1}:INTERPOLATION: minutes ago`);
  });

  it('when more than 1 hour but less than 24 hours have elapsed', () => {
    const TWO_HOURS_IN_MS = ONE_HOUR_IN_MS * 2;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - TWO_HOURS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedHoursAgo:Edited ${2}:INTERPOLATION: hours ago`);
  });

  it('when less than 2 days have elapsed', () => {
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ONE_DAY_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedOneDayAgo:Edited 1 day ago`);
  });

  it('when less than 3 days have elapsed', () => {
    const TWO_DAYS_IN_MS = ONE_DAY_IN_MS * 2;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - TWO_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedTwoDaysAgo:Edited 2 days ago`);
  });

  it('when less than 4 days have elapsed', () => {
    const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - THREE_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedThreeDaysAgo:Edited 3 days ago`);
  });

  it('when less than 7 days have elapsed', () => {
    const SEVEN_DAYS_IN_MS = ONE_DAY_IN_MS * 5;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - SEVEN_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedOneWeekAgo:Edited 1 week ago`);
  });

  it('when less than 14 days have elapsed', () => {
    const ELEVEN_DAYS_IN_MS = ONE_DAY_IN_MS * 11;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - ELEVEN_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedMoreTwoWeeks:Edited less than 2 weeks ago`);
  });

  it('when less than 30 days have elapsed', () => {
    const TWENTYFIVE_DAYS_IN_MS = ONE_DAY_IN_MS * 25;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - TWENTYFIVE_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedLessMonth:Edited less than 1 month`);
  });

  it('when more than 30 days have elapsed', () => {
    const SEVENTY_DAYS_IN_MS = ONE_DAY_IN_MS * 70;
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS - SEVENTY_DAYS_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedMoreMonth:Edited more than a month`);
  });

  it('when the ellapsed time is zero or negative (it is a future date)', () => {
    component.date = ELEVENTH_OF_JUNE_OF_2020_IN_MS + ONE_MINUTE_IN_MS;

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe($localize`:@@EditedMoreMonth:Edited more than a month`);
  });
});
