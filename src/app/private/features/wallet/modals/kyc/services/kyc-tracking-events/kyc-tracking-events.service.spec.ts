import { TestBed } from '@angular/core/testing';

import { KycTrackingEventsService } from './kyc-tracking-events.service';

describe('KycTrackingEventsService', () => {
  let service: KycTrackingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KycTrackingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
