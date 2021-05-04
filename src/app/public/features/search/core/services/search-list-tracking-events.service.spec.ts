import { TestBed } from '@angular/core/testing';

import { SearchListTrackingEventsService } from './search-list-tracking-events.service';

describe('SearchListTrackingEventsService', () => {
  let service: SearchListTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchListTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
