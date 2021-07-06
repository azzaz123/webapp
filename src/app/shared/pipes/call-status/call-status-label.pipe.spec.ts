/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { CallStatusLabelPipe } from './call-status-label.pipe';
import { Component } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-test',
  template: '{{callStatus | callStatusLabel}}',
})
class TestComponent {
  callStatus: string;
}

let component: TestComponent;
let fixture: ComponentFixture<TestComponent>;

describe('CallStatusLabelPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService],
      declarations: [TestComponent, CallStatusLabelPipe],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should return Shared Phone', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe('Shared Phone');
  });

  it('should return Missed Call', () => {
    component.callStatus = 'MISSED';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe('Missed Call');
  });

  it('should return Missed Call', () => {
    component.callStatus = 'ANSWERED';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe('Call');
  });
});
