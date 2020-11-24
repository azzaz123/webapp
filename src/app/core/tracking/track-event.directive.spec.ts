/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TrackingService } from './tracking.service';
import { TrackEventDirective } from './track-event.directive';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';

@Component({
  template: `<a [tslTrackEvent]="event" [params]="params"></a>`,
})
class TestComponent {
  event: string;
  params: any;
}

describe('Directive: TrackEvent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackEventDirective, TestComponent],
      providers: [{ provide: TrackingService, useClass: MockTrackingService }],
    });
    fixture = TestBed.createComponent(TestComponent);
    trackingService = TestBed.inject(TrackingService);
    element = fixture.debugElement.queryAll(
      By.directive(TrackEventDirective)
    )[0];
    spyOn(trackingService, 'track');
  });

  it('should track the click', () => {
    const TRACKING_EVENT = 'SEND_MESSAGE';
    const TRACKING_PARAMS = { test: 'test' };
    fixture.componentInstance.event = TRACKING_EVENT;
    fixture.componentInstance.params = TRACKING_PARAMS;
    fixture.detectChanges();
    element.triggerEventHandler('click', {});
    expect(trackingService.track).toHaveBeenCalledWith(
      TrackingService[TRACKING_EVENT],
      TRACKING_PARAMS
    );
  });
});
