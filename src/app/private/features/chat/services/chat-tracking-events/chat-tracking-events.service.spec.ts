import { TestBed } from '@angular/core/testing';

import { ChatTrackingEventsService } from './chat-tracking-events.service';

describe('ChatTrackingEventsService', () => {
  let service: ChatTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
