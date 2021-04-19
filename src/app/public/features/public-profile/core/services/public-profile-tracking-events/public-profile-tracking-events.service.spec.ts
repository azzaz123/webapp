import { TestBed } from '@angular/core/testing';

import { PublicProfileTrackingEventsService } from './public-profile-tracking-events.service';

describe('PublicProfileTrackingEventsService', () => {
  let service: PublicProfileTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicProfileTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
