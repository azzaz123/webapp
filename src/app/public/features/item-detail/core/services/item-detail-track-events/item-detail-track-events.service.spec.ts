import { TestBed } from '@angular/core/testing';

import { ItemDetailTrackEventsService } from './item-detail-track-events.service';

describe('ItemDetailTrackEventsService', () => {
  let service: ItemDetailTrackEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDetailTrackEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
