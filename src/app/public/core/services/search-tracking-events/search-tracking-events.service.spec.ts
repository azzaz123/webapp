import { TestBed } from '@angular/core/testing';

import { SearchTrackingEventsService } from './search-tracking-events.service';

describe('SearchTrackingEventsService', () => {
  let service: SearchTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
