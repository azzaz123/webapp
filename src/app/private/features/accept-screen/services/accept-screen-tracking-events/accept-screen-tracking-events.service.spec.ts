import { TestBed } from '@angular/core/testing';

import { AcceptScreenTrackingEventsService } from './accept-screen-tracking-events.service';

describe('AcceptScreenTrackingEventsService', () => {
  let service: AcceptScreenTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptScreenTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
