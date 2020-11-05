import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CountdownPipe } from './date-countdown.pipe';
import { Component } from '@angular/core';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
const FAKE_TODAY_IN_MS = 1591867791429;

@Component({
  template: '{{deadlineDateInMs | dateCountdown}}',
})
class MockComponent {
  public deadlineDateInMs;
}

describe('CountdownPipe', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, CountdownPipe],
    });
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(Date.prototype, 'getTime').and.returnValue(FAKE_TODAY_IN_MS);
    spyOn(Date, 'now').and.returnValue(FAKE_TODAY_IN_MS);
  });

  it('should tick date to simulate a countdown', fakeAsync(() => {
    let shownText: string;
    component.deadlineDateInMs = FAKE_TODAY_IN_MS + ONE_DAY_IN_MS * 2;
    fixture.detectChanges();

    tick(5000);
    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('01d 23h 59m 55s');

    tick(ONE_DAY_IN_MS + 10000);
    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('23h 59m 45s');

    tick(ONE_HOUR_IN_MS * 23);
    fixture.detectChanges();
    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('00h 59m 45s');
  }));

  it('should not go below 0 values', fakeAsync(() => {
    let shownText: string;
    component.deadlineDateInMs = FAKE_TODAY_IN_MS + 5000;
    fixture.detectChanges();

    tick(ONE_HOUR_IN_MS);
    fixture.detectChanges();

    shownText = fixture.debugElement.nativeElement.textContent;
    expect(shownText).toBe('00h 00m 00s');
  }));
});
