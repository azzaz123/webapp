import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  discardPeriodicTasks,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateCountDownComponent } from './date-countdown.component';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
const FAKE_TODAY_IN_MS = 1591867791429;

describe('DateCountDownComponent', () => {
  let component: DateCountDownComponent;
  let fixture: ComponentFixture<DateCountDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DateCountDownComponent],
    });

    fixture = TestBed.createComponent(DateCountDownComponent);
    component = fixture.componentInstance;

    spyOn(Date.prototype, 'getTime').and.returnValue(FAKE_TODAY_IN_MS);
    spyOn(Date, 'now').and.returnValue(FAKE_TODAY_IN_MS);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should tick date to simulate a countdown', fakeAsync(() => {
    let shownText: string;

    component.dateEndTimestamp = FAKE_TODAY_IN_MS + ONE_DAY_IN_MS * 2;
    fixture.detectChanges();
    tick(5000);

    fixture.detectChanges();
    shownText = fixture.debugElement.query(By.css('span')).nativeElement
      .textContent;
    expect(shownText).toBe('01d 23h 59m 55s');

    tick(ONE_DAY_IN_MS + 10000);
    fixture.detectChanges();
    shownText = fixture.debugElement.query(By.css('span')).nativeElement
      .textContent;
    expect(shownText).toBe('23h 59m 45s');

    tick(ONE_HOUR_IN_MS * 23);
    fixture.detectChanges();

    shownText = fixture.debugElement.query(By.css('span')).nativeElement
      .textContent;
    expect(shownText).toBe('00h 59m 45s');
    discardPeriodicTasks();
  }));

  it('should not go below 0 values', fakeAsync(() => {
    let shownText: string;
    component.dateEndTimestamp = FAKE_TODAY_IN_MS + 5000;

    fixture.detectChanges();
    tick(ONE_HOUR_IN_MS);
    fixture.detectChanges();

    shownText = fixture.debugElement.query(By.css('span')).nativeElement
      .textContent;
    expect(shownText).toBe('00h 00m 00s');
    discardPeriodicTasks();
  }));
});
