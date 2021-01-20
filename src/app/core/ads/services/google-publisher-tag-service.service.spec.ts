import { TestBed } from '@angular/core/testing';

import { GooglePublisherTagServiceService } from './google-publisher-tag-service.service';

describe('GooglePublisherTagServiceService', () => {
  let service: GooglePublisherTagServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglePublisherTagServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
